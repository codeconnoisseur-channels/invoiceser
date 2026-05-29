import {
  Body, Button, Container, Head, Heading, Hr,
  Html, Img, Preview, Section, Text,
} from "@react-email/components";

export interface PaymentDetails {
  bankName?:        string;
  accountName?:     string;
  accountNumber?:   string;
  sortCode?:        string;
  iban?:            string;
  swiftBic?:        string;
  paymentLink?:     string;
  paymentLinkLabel?: string;
}

interface InvoiceEmailProps {
  companyName:        string;
  logoUrl?:           string;
  clientName:         string;
  invoiceNumber:      string;
  total:              string;
  currency:           string;
  issueDate:          string;
  dueDate:            string;
  publicInvoiceUrl:   string;
  paymentDetails?:    PaymentDetails;
  paymentInstructions?: string; // legacy fallback
}

export function InvoiceEmailTemplate({
  companyName, logoUrl, clientName, invoiceNumber,
  total, currency, issueDate, dueDate,
  publicInvoiceUrl, paymentDetails, paymentInstructions,
}: InvoiceEmailProps) {

  const hasStructuredPayment = paymentDetails && (
    paymentDetails.bankName || paymentDetails.accountNumber || paymentDetails.paymentLink
  );

  return (
    <Html>
      <Head />
      <Preview>Invoice {invoiceNumber} from {companyName} — {total} due {dueDate}</Preview>
      <Body style={{ backgroundColor: "#F8FAFC", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>

          {/* Header */}
          <Section style={{ backgroundColor: "#111827", borderRadius: "16px 16px 0 0", padding: "28px 36px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>
                    {logoUrl && (
                      <Img src={logoUrl} alt={companyName} style={{ maxHeight: 36, maxWidth: 120, marginBottom: 10, display: "block" }} />
                    )}
                    <Heading style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px" }}>
                      {companyName}
                    </Heading>
                    <Text style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Invoice
                    </Text>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "top" }}>
                    <Text style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Invoice #</Text>
                    <Text style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: "#F3F4F6", fontFamily: "monospace" }}>{invoiceNumber}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: "#FFFFFF", padding: "36px 36px 0" }}>
            <Text style={{ fontSize: 15, color: "#374151", margin: "0 0 6px" }}>Hi <strong>{clientName}</strong>,</Text>
            <Text style={{ fontSize: 14, color: "#6B7280", margin: "0 0 28px", lineHeight: "1.6" }}>
              A new invoice has been prepared for you. Please review the details below and make payment before the due date.
            </Text>

            {/* Amount box */}
            <Section style={{
              backgroundColor: "#F0F9FF",
              border: "1.5px solid #BAE6FD",
              borderRadius: 12,
              padding: "24px",
              textAlign: "center",
              margin: "0 0 28px",
            }}>
              <Text style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#0284C7", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Amount Due
              </Text>
              <Heading style={{ margin: "0 0 6px", fontSize: 40, fontWeight: 800, color: "#0F172A", letterSpacing: "-1px" }}>
                {total}
              </Heading>
              <Text style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                {currency}{dueDate && dueDate !== "No due date" ? ` · Due ` : ""}<strong style={{ color: "#0F172A" }}>{dueDate && dueDate !== "No due date" ? dueDate : ""}</strong>
              </Text>
            </Section>

            {/* Invoice details */}
            <Section style={{ backgroundColor: "#F8FAFC", borderRadius: 10, padding: "16px 20px", margin: "0 0 28px", border: "1px solid #E2E8F0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px 0", fontSize: 13, color: "#6B7280", width: "50%" }}>Invoice number</td>
                    <td style={{ padding: "5px 0", fontSize: 13, color: "#0F172A", fontWeight: 600, fontFamily: "monospace", textAlign: "right" }}>{invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px 0", fontSize: 13, color: "#6B7280" }}>Issue date</td>
                    <td style={{ padding: "5px 0", fontSize: 13, color: "#0F172A", fontWeight: 600, textAlign: "right" }}>{issueDate}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px 0", fontSize: 13, color: "#6B7280" }}>Due date</td>
                    <td style={{ padding: "5px 0", fontSize: 13, color: "#0F172A", fontWeight: 600, textAlign: "right" }}>{dueDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: "center", margin: "0 0 32px" }}>
              <Button
                href={publicInvoiceUrl}
                style={{
                  backgroundColor: "#111827",
                  color: "#FFFFFF",
                  borderRadius: 10,
                  padding: "14px 36px",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-block",
                  letterSpacing: "0.01em",
                }}
              >
                View &amp; Pay Invoice →
              </Button>
              <Text style={{ margin: "10px 0 0", fontSize: 12, color: "#9CA3AF" }}>
                Or copy this link: <a href={publicInvoiceUrl} style={{ color: "#3B82F6" }}>{publicInvoiceUrl}</a>
              </Text>
            </Section>
          </Section>

          {/* Payment instructions */}
          {(hasStructuredPayment || paymentInstructions) && (
            <Section style={{ backgroundColor: "#FFFFFF", padding: "0 36px 32px" }}>
              <Hr style={{ borderColor: "#E2E8F0", margin: "0 0 24px" }} />
              <Text style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                How to Pay
              </Text>
              {hasStructuredPayment ? (
                <Section style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {paymentDetails?.bankName && (
                        <tr>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280", width: "40%" }}>Bank</td>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{paymentDetails.bankName}</td>
                        </tr>
                      )}
                      {paymentDetails?.accountName && (
                        <tr>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Account name</td>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{paymentDetails.accountName}</td>
                        </tr>
                      )}
                      {paymentDetails?.accountNumber && (
                        <tr>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Account no.</td>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 700, fontFamily: "monospace" }}>{paymentDetails.accountNumber}</td>
                        </tr>
                      )}
                      {paymentDetails?.sortCode && (
                        <tr>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Sort code</td>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 700, fontFamily: "monospace" }}>{paymentDetails.sortCode}</td>
                        </tr>
                      )}
                      {paymentDetails?.iban && (
                        <tr>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>IBAN</td>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 600, fontFamily: "monospace" }}>{paymentDetails.iban}</td>
                        </tr>
                      )}
                      {paymentDetails?.swiftBic && (
                        <tr>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Swift / BIC</td>
                          <td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 600, fontFamily: "monospace" }}>{paymentDetails.swiftBic}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {paymentDetails?.paymentLink && (
                    <Section style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
                      <Button
                        href={paymentDetails.paymentLink}
                        style={{ backgroundColor: "#2563EB", color: "#FFFFFF", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                      >
                        {paymentDetails.paymentLinkLabel || "Pay Online →"}
                      </Button>
                    </Section>
                  )}
                </Section>
              ) : (
                <Text style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-wrap", lineHeight: "1.7", margin: 0, backgroundColor: "#F8FAFC", padding: "14px 18px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                  {paymentInstructions}
                </Text>
              )}
            </Section>
          )}

          {/* Footer */}
          <Section style={{ backgroundColor: "#F8FAFC", borderRadius: "0 0 16px 16px", padding: "16px 36px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
            <Text style={{ color: "#9CA3AF", fontSize: 12, margin: 0, lineHeight: "1.6" }}>
              This invoice was sent by <strong style={{ color: "#6B7280" }}>{companyName}</strong> via{" "}
              <strong style={{ color: "#374151" }}>Invoiceser</strong>.
              If you have questions, please contact {companyName} directly.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default InvoiceEmailTemplate;
