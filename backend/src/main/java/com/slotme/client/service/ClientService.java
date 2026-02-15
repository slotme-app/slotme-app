package com.slotme.client.service;

import com.slotme.client.dto.ClientResponse;
import com.slotme.client.dto.CreateClientRequest;
import com.slotme.client.dto.UpdateClientRequest;
import com.slotme.client.entity.Client;
import com.slotme.client.repository.ClientRepository;
import com.slotme.common.exception.ConflictException;
import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.UUID;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Page<ClientResponse> listClients(UUID salonId, String query, Pageable pageable) {
        Page<Client> clients;
        if (query != null && !query.isBlank()) {
            clients = clientRepository.search(salonId, query, pageable);
        } else {
            clients = clientRepository.findBySalonId(salonId, pageable);
        }
        return clients.map(this::toResponse);
    }

    public ClientResponse getClient(UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
        return toResponse(client);
    }

    @Transactional
    public ClientResponse createClient(UUID salonId, CreateClientRequest request) {
        UUID tenantId = SecurityUtils.getCurrentTenantId();

        if (clientRepository.findBySalonIdAndPhone(salonId, request.phone()).isPresent()) {
            throw new ConflictException("Client with this phone number already exists in this salon");
        }

        Client client = new Client();
        client.setTenantId(tenantId);
        client.setSalonId(salonId);
        client.setFirstName(request.firstName());
        client.setLastName(request.lastName());
        client.setPhone(request.phone());
        client.setEmail(request.email());
        client.setNotes(request.notes());
        client.setTags(request.tags() != null ? request.tags().toArray(new String[0]) : null);
        client.setSource(request.source() != null ? request.source() : "manual");
        client = clientRepository.save(client);

        return toResponse(client);
    }

    @Transactional
    public ClientResponse updateClient(UUID clientId, UpdateClientRequest request) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));

        if (request.firstName() != null) client.setFirstName(request.firstName());
        if (request.lastName() != null) client.setLastName(request.lastName());
        if (request.phone() != null) client.setPhone(request.phone());
        if (request.email() != null) client.setEmail(request.email());
        if (request.notes() != null) client.setNotes(request.notes());
        if (request.tags() != null) client.setTags(request.tags().toArray(new String[0]));

        client = clientRepository.save(client);
        return toResponse(client);
    }

    @Transactional
    public Client findOrCreateByPhone(UUID salonId, String phone, String source) {
        return clientRepository.findBySalonIdAndPhone(salonId, phone)
                .orElseGet(() -> {
                    Client client = new Client();
                    client.setTenantId(SecurityUtils.getCurrentTenantId());
                    client.setSalonId(salonId);
                    client.setPhone(phone);
                    client.setSource(source);
                    return clientRepository.save(client);
                });
    }

    public Client getClientEntity(UUID clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
    }

    @Transactional
    public void updateTags(UUID clientId, String[] tags) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
        client.setTags(tags);
        clientRepository.save(client);
    }

    private ClientResponse toResponse(Client client) {
        return new ClientResponse(
                client.getId().toString(),
                client.getSalonId().toString(),
                client.getFirstName(),
                client.getLastName(),
                client.getPhone(),
                client.getEmail(),
                client.getNotes(),
                client.getTags() != null ? Arrays.asList(client.getTags()) : null,
                client.getSource(),
                client.getLastVisitAt(),
                client.getTotalVisits(),
                client.getCreatedAt()
        );
    }
}
