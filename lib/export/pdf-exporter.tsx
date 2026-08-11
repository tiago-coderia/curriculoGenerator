import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { ResumeDocument } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 36, // 0.5 in margins
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#2D3748',
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 11,
    color: '#4A5568',
    marginTop: 2,
    marginBottom: 4,
  },
  contact: {
    fontSize: 8.5,
    color: '#718096',
  },
  section: {
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A365D',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E0',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 9.5,
    textAlign: 'justify',
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  skillCategory: {
    fontWeight: 'bold',
    width: 140,
    fontSize: 9.5,
  },
  skillList: {
    flex: 1,
    fontSize: 9.5,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  expRole: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#2D3748',
  },
  expCompany: {
    fontSize: 9.5,
    color: '#4A5568',
  },
  expDates: {
    fontSize: 8.5,
    color: '#718096',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
  },
});

function ResumePdfComponent({ resume }: { resume: ResumeDocument }) {
  const contacts = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin,
    resume.personalInfo.github,
    resume.personalInfo.portfolio,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.personalInfo.name}</Text>
          {resume.personalInfo.headline && (
            <Text style={styles.headline}>{resume.personalInfo.headline}</Text>
          )}
          <Text style={styles.contact}>{contacts.join('  |  ')}</Text>
        </View>

        {/* Professional Summary */}
        {resume.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{resume.professionalSummary}</Text>
          </View>
        )}

        {/* Core Skills */}
        {resume.skillGroups && resume.skillGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CORE SKILLS</Text>
            {resume.skillGroups.map((group, i) => (
              <View key={i} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{group.category}:</Text>
                <Text style={styles.skillList}>{group.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Professional Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {resume.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.expHeader}>
                  <Text style={styles.expRole}>
                    {exp.role} <Text style={styles.expCompany}>— {exp.company}</Text>
                  </Text>
                  <Text style={styles.expDates}>{exp.dates}</Text>
                </View>
                {exp.bullets.map((bullet, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Selected Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECTED PROJECTS</Text>
            {resume.projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <Text style={styles.expRole}>{proj.name} {proj.role ? `(${proj.role})` : ''}</Text>
                {proj.bullets.map((bullet, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {resume.education.map((edu, i) => (
              <View key={i} style={styles.expHeader}>
                <Text style={styles.expRole}>
                  {edu.degree}{edu.field ? ` em ${edu.field}` : ''} <Text style={styles.expCompany}>— {edu.institution}</Text>
                </Text>
                <Text style={styles.expDates}>{edu.dates}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
            {resume.certifications.map((cert, i) => (
              <View key={i} style={styles.expHeader}>
                <Text style={styles.expRole}>
                  {cert.name} <Text style={styles.expCompany}>— {cert.issuer}</Text>
                </Text>
                {cert.date && <Text style={styles.expDates}>{cert.date}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function generatePdfBuffer(resume: ResumeDocument): Promise<Buffer> {
  return await renderToBuffer(<ResumePdfComponent resume={resume} />);
}
