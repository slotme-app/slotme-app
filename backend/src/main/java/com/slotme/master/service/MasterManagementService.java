package com.slotme.master.service;

import com.slotme.auth.entity.User;
import com.slotme.auth.entity.UserRole;
import com.slotme.auth.repository.UserRepository;
import com.slotme.calendar.entity.Calendar;
import com.slotme.calendar.repository.CalendarRepository;
import com.slotme.common.exception.ConflictException;
import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.master.dto.CreateMasterRequest;
import com.slotme.master.dto.MasterResponse;
import com.slotme.master.dto.UpdateMasterRequest;
import com.slotme.master.entity.Master;
import com.slotme.master.entity.MasterService;
import com.slotme.master.repository.MasterRepository;
import com.slotme.master.repository.MasterServiceRepository;
import com.slotme.security.SecurityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MasterManagementService {

    private final MasterRepository masterRepository;
    private final MasterServiceRepository masterServiceRepository;
    private final UserRepository userRepository;
    private final CalendarRepository calendarRepository;
    private final PasswordEncoder passwordEncoder;

    public MasterManagementService(MasterRepository masterRepository,
                                    MasterServiceRepository masterServiceRepository,
                                    UserRepository userRepository,
                                    CalendarRepository calendarRepository,
                                    PasswordEncoder passwordEncoder) {
        this.masterRepository = masterRepository;
        this.masterServiceRepository = masterServiceRepository;
        this.userRepository = userRepository;
        this.calendarRepository = calendarRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<MasterResponse> listMasters(UUID salonId) {
        return masterRepository.findBySalonIdOrderBySortOrder(salonId).stream()
                .map(this::toResponse)
                .toList();
    }

    public MasterResponse getMaster(UUID masterId) {
        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new ResourceNotFoundException("Master", masterId));
        return toResponse(master);
    }

    @Transactional
    public MasterResponse createMaster(UUID salonId, CreateMasterRequest request) {
        UUID tenantId = SecurityUtils.getCurrentTenantId();

        if (userRepository.existsByTenantIdAndEmail(tenantId, request.email())) {
            throw new ConflictException("User with this email already exists");
        }

        // Create user account for the master
        User user = new User();
        user.setTenantId(tenantId);
        user.setSalonId(salonId);
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString())); // temp password
        user.setFirstName(request.resolvedFirstName());
        user.setLastName(request.resolvedLastName());
        user.setPhone(request.phone());
        user.setRole(UserRole.MASTER);
        user = userRepository.save(user);

        // Create master profile
        Master master = new Master();
        master.setTenantId(tenantId);
        master.setSalonId(salonId);
        master.setUserId(user.getId());
        master.setDisplayName(request.resolvedDisplayName());
        master.setBio(request.bio());
        master.setSpecialization(request.specialization());
        master = masterRepository.save(master);

        // Create default calendar for the master
        Calendar calendar = new Calendar();
        calendar.setTenantId(tenantId);
        calendar.setMasterId(master.getId());
        calendarRepository.save(calendar);

        // Assign services
        if (request.serviceIds() != null) {
            assignServices(master.getId(), request.serviceIds());
        }

        return toResponse(master);
    }

    @Transactional
    public MasterResponse updateMaster(UUID masterId, UpdateMasterRequest request) {
        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new ResourceNotFoundException("Master", masterId));

        if (request.displayName() != null) master.setDisplayName(request.displayName());
        if (request.bio() != null) master.setBio(request.bio());
        if (request.specialization() != null) master.setSpecialization(request.specialization());
        if (request.avatarUrl() != null) master.setAvatarUrl(request.avatarUrl());
        if (request.active() != null) master.setActive(request.active());

        master = masterRepository.save(master);

        if (request.serviceIds() != null) {
            // Clear existing and reassign
            masterServiceRepository.findByMasterId(masterId)
                    .forEach(ms -> masterServiceRepository.delete(ms));
            assignServices(masterId, request.serviceIds());
        }

        return toResponse(master);
    }

    @Transactional
    public void deactivateMaster(UUID masterId) {
        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new ResourceNotFoundException("Master", masterId));
        master.setActive(false);
        masterRepository.save(master);
    }

    @Transactional
    public void activateMaster(UUID masterId) {
        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new ResourceNotFoundException("Master", masterId));
        master.setActive(true);
        masterRepository.save(master);
    }

    private void assignServices(UUID masterId, List<String> serviceIds) {
        for (String serviceIdStr : serviceIds) {
            UUID serviceId = UUID.fromString(serviceIdStr);
            MasterService ms = new MasterService();
            ms.setMasterId(masterId);
            ms.setServiceId(serviceId);
            masterServiceRepository.save(ms);
        }
    }

    private MasterResponse toResponse(Master master) {
        List<String> serviceIds = masterServiceRepository.findByMasterId(master.getId()).stream()
                .map(ms -> ms.getServiceId().toString())
                .toList();

        // Look up user email/phone for frontend display
        String email = "";
        String phone = null;
        var userOpt = userRepository.findById(master.getUserId());
        if (userOpt.isPresent()) {
            email = userOpt.get().getEmail();
            phone = userOpt.get().getPhone();
        }

        String status = master.isActive() ? "ACTIVE" : "INACTIVE";

        return new MasterResponse(
                master.getId().toString(),
                master.getSalonId().toString(),
                master.getUserId().toString(),
                master.getDisplayName(),
                master.getDisplayName(),
                email,
                phone,
                master.getBio(),
                master.getSpecialization(),
                master.getAvatarUrl(),
                master.isActive(),
                status,
                master.getSortOrder(),
                serviceIds,
                serviceIds,
                master.getCreatedAt()
        );
    }
}
