package com.example.demo.Services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;


import com.example.demo.Entity.Invoice;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true indicates this is HTML content

        mailSender.send(message);
    }

    // Email template for verification
    public String createVerificationEmailTemplate(String name, String verificationUrl) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8'>"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<title>Email Verification</title>"
                + "<style>"
                + "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }"
                + ".header { background-color: #f8f9fa; padding: 20px; text-align: center; }"
                + ".content { padding: 20px; }"
                + ".button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; "
                + "border-radius: 5px; margin: 20px 0; }"
                + ".footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='header'>"
                + "<h2>Verify Your Email Address</h2>"
                + "</div>"
                + "<div class='content'>"
                + "<p>Hello " + name + ",</p>"
                + "<p>Thank you for registering! Please click the button below to verify your email address:</p>"
                + "<a href='" + verificationUrl + "' class='button'>Verify Email</a>"
                + "<p>If you didn't request this, please ignore this email.</p>"
                + "</div>"
                + "<div class='footer'>"
                + "<p>This is an automated message. Please do not reply to this email.</p>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    // Email template for password reset
    public String createPasswordResetEmailTemplate(String name, String resetUrl, int expiryHours) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8'>"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<title>Password Reset</title>"
                + "<style>"
                + "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }"
                + ".header { background-color: #f8f9fa; padding: 20px; text-align: center; }"
                + ".content { padding: 20px; }"
                + ".button { display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; "
                + "border-radius: 5px; margin: 20px 0; }"
                + ".footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='header'>"
                + "<h2>Reset Your Password</h2>"
                + "</div>"
                + "<div class='content'>"
                + "<p>Hello " + name + ",</p>"
                + "<p>We received a request to reset your password. Click the button below to create a new password:</p>"
                + "<a href='" + resetUrl + "' class='button'>Reset Password</a>"
                + "<p>This link will expire in " + expiryHours + " hours.</p>"
                + "<p>If you didn't request a password reset, please ignore this email.</p>"
                + "</div>"
                + "<div class='footer'>"
                + "<p>This is an automated message. Please do not reply to this email.</p>"
                + "</div>"
                + "</body>"
                + "</html>";
    }





    @Autowired
    private PdfService pdfService;

    public void sendInvoiceEmail(Invoice invoice) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(invoice.getEmailId());
            helper.setSubject("Invoice #" + invoice.getInvoiceNo() + " from " + invoice.getChain().getCompanyName());
            helper.setText("Please find attached your invoice for the services provided. Thank you for your business.");

            // Generate the PDF and attach it
            byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);
            helper.addAttachment("Invoice_" + invoice.getInvoiceNo() + ".pdf", new ByteArrayResource(pdfBytes));

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email with invoice", e);
        }
    }


}