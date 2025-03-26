package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Entity.Invoice;
import com.example.demo.Entity.Estimate;
import com.example.demo.Repository.InvoiceRepository;
import com.example.demo.Repository.EstimateRepository;
import com.example.demo.Repository.ChainRepository;
import com.example.demo.Entity.Chain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private EstimateRepository estimateRepository;

    @Autowired
    private ChainRepository chainRepository;

    @Autowired
    private EmailService emailService;

    // Get all invoices
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Get invoice by id
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }


    // Search invoices by criteria (invoice number, estimate id, chain id, or company name)
    public List<Invoice> searchInvoices(String searchTerm) {
        // Try to parse the search term as a number for ID searches
        Long searchId = null;
        try {
            searchId = Long.parseLong(searchTerm);
        } catch (NumberFormatException ignored) {
            // Not a number, will search by strings only
        }

        List<Invoice> byInvoiceNo = invoiceRepository.findByInvoiceNoContainingIgnoreCase(searchTerm);

        List<Invoice> byEstimateId = searchId != null ?
                invoiceRepository.findByEstimateEstimateId(searchId) :
                List.of();

        List<Invoice> byChainId = searchId != null ?
                invoiceRepository.findByChainChainId(searchId) :
                List.of();

        List<Invoice> byCompanyName = invoiceRepository.findByChainCompanyNameContainingIgnoreCase(searchTerm);

        // Combine and remove duplicates
        return Stream.of(byInvoiceNo, byEstimateId, byChainId, byCompanyName)
                .flatMap(List::stream)
                .distinct()
                .collect(Collectors.toList());
    }

    // Generate invoice from estimate
    @Transactional
    public Invoice generateInvoice(Long estimateId, String emailId, Float amountPaid) {
        // Find the estimate
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new RuntimeException("Estimate not found with id: " + estimateId));

        // Create new invoice
        Invoice invoice = new Invoice();
        invoice.setEstimate(estimate);
        invoice.setChain(estimate.getChain());
        invoice.setServiceDetails(estimate.getService());
        invoice.setQty(estimate.getQuantity());
        invoice.setCostPerQty(estimate.getCostPerUnit());

        // Calculate amount payable and balance
        float totalAmount = estimate.getTotalCost();
        invoice.setAmountPayable(amountPaid);

        // If partial payment, set balance
        if (amountPaid < totalAmount) {
            invoice.setBalance(totalAmount - amountPaid);
        } else {
            invoice.setBalance(0F);
        }

        invoice.setDateOfPayment(LocalDateTime.now());
        invoice.setDateOfService(estimate.getDeliveryDate());
        invoice.setDeliveryDetails(estimate.getDeliveryDetails());
        invoice.setEmailId(emailId);

        // Save invoice
        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Send email with PDF invoice
        emailService.sendInvoiceEmail(savedInvoice);

        return savedInvoice;
    }

    // Update invoice (only email is editable)
    public Invoice updateInvoice(Long id, String emailId) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));

        invoice.setEmailId(emailId);
        invoice.setUpdatedAt(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }

    // Delete invoice
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    // Generate PDF for invoice
    public byte[] generateInvoicePdf(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));

        return PdfService.generateInvoicePdf(invoice);
    }

    public void sendInvoiceEmail(Long invoiceId) throws Exception {
        // Get the invoice
        Optional<Invoice> invoiceOpt = getInvoiceById(invoiceId);
        if (!invoiceOpt.isPresent()) {
            throw new Exception("Invoice not found with id: " + invoiceId);
        }

        Invoice invoice = invoiceOpt.get();

        // Check if email exists
        if (invoice.getEmailId() == null || invoice.getEmailId().trim().isEmpty()) {
            throw new Exception("No email address associated with this invoice");
        }

        // Generate PDF for attachment
        byte[] pdfContent = generateInvoicePdf(invoiceId);

        // Here you would normally use JavaMailSender to send the email
        // For demonstration, we'll just log that we'd send an email

        // Implement your email sending logic here
        // For example:
        /*
        JavaMailSender mailSender = // your configured mail sender

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(invoice.getEmailId());
        helper.setSubject("Invoice #" + invoice.getInvoiceNumber());
        helper.setText("Please find attached your invoice #" + invoice.getInvoiceNumber());

        // Add the PDF attachment
        helper.addAttachment("Invoice_" + invoice.getInvoiceNumber() + ".pdf",
                             new ByteArrayResource(pdfContent));

        mailSender.send(message);
        */

        // For now, just logging that we would send the email
        System.out.println("Would send invoice #" + invoice.generateInvoiceNumber() +
                " to email: " + invoice.getEmailId());
    }
}