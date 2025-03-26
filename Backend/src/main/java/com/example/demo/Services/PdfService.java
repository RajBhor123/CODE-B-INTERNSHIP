package com.example.demo.Services;

import com.example.demo.Entity.Invoice;
import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public static byte[] generateInvoicePdf(Invoice invoice) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            addHeader(document, invoice);
            addInvoiceDetails(document, invoice);
            addServiceDetails(document, invoice);
            addPaymentDetails(document, invoice);
            addFooter(document, invoice);

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error generating PDF invoice", e);
        }
    }

    private static void addHeader(Document document, Invoice invoice) throws DocumentException, IOException {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24);
        Paragraph header = new Paragraph("INVOICE", headerFont);
        header.setAlignment(Element.ALIGN_CENTER);
        header.setSpacingAfter(20);
        document.add(header);

        Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Paragraph company = new Paragraph();
        company.add(new Chunk(invoice.getChain().getCompanyName() + "\n", companyFont));
        company.add(new Chunk("GSTN: " + invoice.getChain().getGstnNo() + "\n"));
        company.setSpacingAfter(20);
        document.add(company);
    }

    private static void addInvoiceDetails(Document document, Invoice invoice) throws DocumentException, IOException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Invoice Number:", invoice.getInvoiceNo());
        addTableCell(table, "Invoice Date:",
                invoice.getDateOfPayment().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        addTableCell(table, "Estimate ID:", invoice.getEstimate().toString());

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private static void addServiceDetails(Document document, Invoice invoice) throws DocumentException, IOException {
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Paragraph sectionHeader = new Paragraph("Service Details", sectionFont);
        sectionHeader.setSpacingAfter(10);
        document.add(sectionHeader);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        addTableHeaderCell(table, "Service");
        addTableHeaderCell(table, "Quantity");
        addTableHeaderCell(table, "Cost per Unit");
        addTableHeaderCell(table, "Total");

        table.addCell(createCell(invoice.getServiceDetails(), false));
        table.addCell(createCell(invoice.getQty().toString(), false));
        table.addCell(createCell("₹" + invoice.getCostPerQty(), false));
        table.addCell(createCell("₹" + String.format("%.2f", invoice.getQty() * invoice.getCostPerQty()), false));

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private static void addPaymentDetails(Document document, Invoice invoice) throws DocumentException, IOException {
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Paragraph sectionHeader = new Paragraph("Payment Details", sectionFont);
        sectionHeader.setSpacingAfter(10);
        document.add(sectionHeader);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3, 1});

        addTableCell(table, "Total Amount:", "₹" + String.format("%.2f", invoice.getQty() * invoice.getCostPerQty()));
        addTableCell(table, "Amount Paid:", "₹" + invoice.getAmountPayable());

        if (invoice.getBalance() != null && invoice.getBalance() > 0) {
            addTableCell(table, "Balance Due:", "₹" + invoice.getBalance());
        }

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private static void addFooter(Document document, Invoice invoice) throws DocumentException, IOException {
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Paragraph sectionHeader = new Paragraph("Delivery Information", sectionFont);
        sectionHeader.setSpacingAfter(10);
        document.add(sectionHeader);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Delivery Date:",
                invoice.getDateOfService().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        addTableCell(table, "Delivery Details:", invoice.getDeliveryDetails());

        document.add(table);

        Font thankYouFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 12);
        Paragraph thankYou = new Paragraph("Thank you for your business!", thankYouFont);
        thankYou.setSpacingBefore(40);
        thankYou.setAlignment(Element.ALIGN_CENTER);
        document.add(thankYou);
    }

    // Helper Methods
    private static void addTableCell(PdfPTable table, String label, String value) throws DocumentException, IOException {
        table.addCell(createCell(label, true));
        table.addCell(createCell(value, false));
    }

    private static void addTableHeaderCell(PdfPTable table, String text) throws DocumentException, IOException {
        table.addCell(createCell(text, true));
    }

    private static PdfPCell createCell(String content, boolean isHeader) throws DocumentException, IOException {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(5);

        Font font = isHeader
                ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)
                : FontFactory.getFont(FontFactory.HELVETICA, 12);

        cell.setPhrase(new Phrase(content, font));

        if (isHeader) {
            // ✅ Use BaseColor instead of java.awt.Color
            cell.setBackgroundColor(new BaseColor(220, 220, 220)); // Light gray
        }

        return cell;
    }
}