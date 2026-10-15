import { useMemo, useState, type FormEvent } from 'react';

type StudentStatus = 'Present' | 'Late' | 'Absent' | 'Pending' | 'Excused';
type StudentMethod = 'Face verification' | 'Manual check-in' | 'Not recorded';

type StudentRecord = {
  id: string;
  name: string;
  studentId: string;
  className: string;
  checkIn: string;
  status: StudentStatus;
  method: StudentMethod;
  notes: string;
};

type FormErrors<T> = Partial<Record<keyof T, string>>;

type InstitutionEnquiry = {
  fullName: string;
  workEmail: string;
  institutionName: string;
  institutionType: string;
  jobTitle: string;
  studentPopulation: string;
  currentMethod: string;
  mainChallenge: string;
  preferredFollowUp: string;
  consent: boolean;
};

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For institutions', href: '#institutions' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'FAQ', href: '#faq' },
];

const problemCards = [
  {
    title: 'Time spent on roll calls',
    icon: '◔',
    description:
      'Manual attendance can interrupt the start of a lesson and take time away from teaching, especially when several classes need to be recorded.',
  },
  {
    title: 'Records scattered across systems',
    icon: '▣',
    description:
      'When attendance information is recorded across paper registers, spreadsheets, or separate systems, reviewing class records can become unnecessarily difficult.',
  },
  {
    title: 'Limited attendance visibility',
    icon: '▤',
    description:
      'Administrators need a clear way to review absences, late arrivals, and attendance patterns without manually combining multiple records.',
  },
];

const processSteps = [
  {
    title: 'Verify identity',
    description:
      'An authorised check-in device runs the configured identity verification process using an enrolled reference, subject to the institution’s chosen workflow and applicable safeguards.',
  },
  {
    title: 'Record attendance',
    description:
      'After a successful verification and applicable attendance checks, the system records a timestamp and the relevant class attendance status.',
  },
  {
    title: 'Review attendance',
    description:
      'Teachers and authorised administrators can view records, correct errors, and review attendance summaries in the dashboard.',
  },
];

const studentOptions = [
  { id: 'ST1024', name: 'Alex Tan' },
  { id: 'ST1031', name: 'Maya Lim' },
  { id: 'ST1042', name: 'Ethan Wong' },
  { id: 'ST1050', name: 'Sofia Chen' },
];

const initialRecords: StudentRecord[] = [
  { id: '1', name: 'Alex Tan', studentId: 'ST1024', className: 'Class 3A', checkIn: '08:12', status: 'Present', method: 'Face verification', notes: 'Verified at the morning session.' },
  { id: '2', name: 'Maya Lim', studentId: 'ST1031', className: 'Class 3A', checkIn: '08:18', status: 'Late', method: 'Face verification', notes: 'Late arrival recorded after start of session.' },
  { id: '3', name: 'Ethan Wong', studentId: 'ST1042', className: 'Class 3A', checkIn: '-', status: 'Pending', method: 'Not recorded', notes: 'Awaiting attendance confirmation.' },
  { id: '4', name: 'Sofia Chen', studentId: 'ST1050', className: 'Class 3A', checkIn: '-', status: 'Absent', method: 'Not recorded', notes: 'No check-in recorded for the session.' },
  { id: '5', name: 'Liam Carter', studentId: 'ST2108', className: 'Class 4B', checkIn: '09:02', status: 'Present', method: 'Face verification', notes: 'Attendance confirmed for the pre-lecture check-in.' },
  { id: '6', name: 'Priya Nair', studentId: 'ST2120', className: 'Class 4B', checkIn: '09:14', status: 'Late', method: 'Manual check-in', notes: 'Staff-assisted verification completed after the session started.' },
  { id: '7', name: 'Noah Lee', studentId: 'ST2141', className: 'Class 4B', checkIn: '-', status: 'Pending', method: 'Not recorded', notes: 'Waiting for staff follow-up.' },
  { id: '8', name: 'Zara Ali', studentId: 'ST3190', className: 'Class 2D', checkIn: '10:04', status: 'Present', method: 'Face verification', notes: 'Matched successfully during morning check-in.' },
  { id: '9', name: 'Ethan Pereira', studentId: 'ST3201', className: 'Class 2D', checkIn: '10:26', status: 'Excused', method: 'Manual check-in', notes: 'Excused due to approved late arrival.' },
  { id: '10', name: 'Grace Ong', studentId: 'ST3264', className: 'Class 2D', checkIn: '-', status: 'Absent', method: 'Not recorded', notes: 'No check-in submitted for the session.' },
];

const featureCards = [
  {
    title: 'Facial recognition check-in',
    description: 'Explore a proposed face-based check-in workflow for enrolled students using an institution-configured verification system.',
  },
  {
    title: 'Centralised attendance records',
    description: 'Review student attendance across classes and sessions from a structured dashboard.',
  },
  {
    title: 'Live session visibility',
    description: 'See which attendance records have been confirmed, which are pending, and which need attention.',
  },
  {
    title: 'Attendance reporting',
    description: 'Review attendance totals, late arrivals, absences, and historical trends through clear reports.',
  },
  {
    title: 'Administrative corrections',
    description: 'Correct mistakes through a controlled workflow with reasons and an audit trail.',
  },
  {
    title: 'Alternative check-in methods',
    description: 'Support manual or staff-assisted check-in when facial recognition is unsuccessful, unavailable, or inappropriate.',
  },
];

const institutionCards = [
  {
    title: 'Schools and secondary education',
    copy:
      'Help teachers manage classroom attendance through a clear process while keeping student privacy and school procedures central.',
  },
  {
    title: 'Colleges and polytechnics',
    copy:
      'Give lecturers and administrators a more organised way to review attendance across different classes and teaching sessions.',
  },
  {
    title: 'Universities',
    copy:
      'Explore a centralised approach to attendance management across courses, faculties, and authorised administrative teams.',
  },
];

const privacyCards = [
  {
    title: 'Clear information',
    description:
      'Students, parents or guardians where appropriate, and staff should receive understandable information about what the system does, what data is used, and how attendance records are handled.',
  },
  {
    title: 'Data minimisation',
    description:
      'Collect and retain only the information necessary for the defined attendance purpose. Avoid storing raw facial images or biometric templates unless their use is necessary, justified, and appropriately protected.',
  },
  {
    title: 'Restricted access',
    description:
      'Attendance records and any biometric information must be protected through appropriate access controls, security measures, and retention policies.',
  },
  {
    title: 'Alternative check-in',
    description:
      'Provide an accessible alternative for students who cannot use facial recognition, encounter recognition failures, or need a different verification method.',
  },
];

const implementationSteps = [
  'Review class structures, attendance policies, existing systems, and the problem the institution wants to solve.',
  'Define roles, attendance statuses, exception handling, and alternative check-in methods.',
  'Assess data protection, hardware, access controls, security, system compatibility, and the suitability of facial recognition for the proposed setting.',
  'Test the workflow in a limited environment, evaluate accuracy and usability, collect feedback, and decide whether a broader rollout is justified.',
];

const faqItems = [
  {
    question: 'What is FaceMark?',
    answer:
      'FaceMark is a proposed attendance management platform designed to help educational institutions explore facial recognition-based check-in and manage attendance records through a centralised dashboard.',
  },
  {
    question: 'Does FaceMark perform real facial recognition in this demo?',
    answer:
      'No. The website uses simulated outcomes and fictional student records. It does not access your camera or process your face.',
  },
  {
    question: 'Does a successful face match automatically mark a student present?',
    answer:
      'A real system would need to apply the institution’s attendance rules and verify that the check-in belongs to the correct session. The demonstration simplifies this workflow.',
  },
  {
    question: 'What happens if facial recognition fails?',
    answer:
      'A real deployment should provide a retry process and an authorised alternative check-in method. A failed match should not automatically be treated as an absence.',
  },
  {
    question: 'Is student biometric data stored?',
    answer:
      'No biometric data is collected or stored by this website demonstration. Any real deployment would require a clearly defined data handling, security, and retention approach.',
  },
  {
    question: 'Can schools review attendance records?',
    answer:
      'The proposed product includes an attendance dashboard with student lists, attendance statuses, summaries, and administrative correction workflows.',
  },
  {
    question: 'Can attendance records be corrected?',
    answer:
      'The demonstration allows sample attendance statuses to be changed and records the changes in a simulated audit trail. Actual persistence and permissions would require a backend.',
  },
  {
    question: 'Does FaceMark integrate with existing school systems?',
    answer:
      'Integrations would depend on the institution’s systems, available interfaces, security requirements, and technical assessment. No live integrations are included in this demonstration.',
  },
  {
    question: 'Is FaceMark available for schools now?',
    answer:
      'FaceMark is presented as a product concept and interactive demonstration. Availability, deployment readiness, and institutional partnerships must be confirmed separately.',
  },
  {
    question: 'Is facial recognition appropriate for every student?',
    answer:
      'Not necessarily. Institutions must assess necessity, proportionality, privacy, accessibility, reliability, and applicable legal requirements. Appropriate alternative attendance methods should be available.',
  },
  {
    question: 'Does FaceMark guarantee accurate attendance?',
    answer:
      'No. The demonstration does not measure recognition accuracy. A real system would need appropriate testing, exception handling, monitoring, and human review.',
  },
  {
    question: 'How can an institution learn more?',
    answer:
      'Educational institutions can use the enquiry form to express interest in discussing a potential pilot.',
  },
];

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function LogoMark({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`logo-mark ${light ? 'light' : ''}`}>
      <circle cx="32" cy="32" r="26" fill={light ? 'rgba(255,255,255,0.08)' : 'rgba(20,38,61,0.08)'} />
      <path
        d="M19 39V23c0-7 5-12 13-12s13 5 13 12v16M23 38h18M22 38l6-8 7 6 9-13"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="24" r="5" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M39 46l9 9-9-9Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedStudentId, setSelectedStudentId] = useState('ST1024');
  const [checkInState, setCheckInState] = useState<'ready' | 'verifying' | 'verified' | 'noMatch' | 'alternate' | 'completed'>('ready');
  const [checkInResult, setCheckInResult] = useState<string>('');
  const [demoRecordedAt, setDemoRecordedAt] = useState('08:12 AM');
  const [altCheckInId, setAltCheckInId] = useState('ST1031');
  const [altCheckInConfirmed, setAltCheckInConfirmed] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [exported, setExported] = useState(false);
  const [records, setRecords] = useState<StudentRecord[]>(initialRecords);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All classes');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [methodFilter, setMethodFilter] = useState('All methods');
  const [auditTrail, setAuditTrail] = useState([
    { id: 1, admin: 'A. Lim', action: 'Class 3A session opened', time: '08:00 AM' },
    { id: 2, admin: 'R. Singh', action: 'Attendance report generated', time: '09:15 AM' },
    { id: 3, admin: 'K. Tan', action: 'Correction approved for Maya Lim', time: '09:35 AM' },
  ]);
  const [enquiryForm, setEnquiryForm] = useState<InstitutionEnquiry>({
    fullName: '',
    workEmail: '',
    institutionName: '',
    institutionType: '',
    jobTitle: '',
    studentPopulation: '',
    currentMethod: '',
    mainChallenge: '',
    preferredFollowUp: '',
    consent: false,
  });
  const [enquiryErrors, setEnquiryErrors] = useState<FormErrors<InstitutionEnquiry>>({});

  const selectedStudent = studentOptions.find((student) => student.id === selectedStudentId) ?? studentOptions[0];
  const selectedTableRecord = records.find((record) => record.id === selectedRecordId) ?? records[0];

  const summary = useMemo(() => {
    const totals = {
      total: records.length,
      present: records.filter((record) => record.status === 'Present').length,
      late: records.filter((record) => record.status === 'Late').length,
      absent: records.filter((record) => record.status === 'Absent').length,
      pending: records.filter((record) => record.status === 'Pending').length,
    };
    return totals;
  }, [records]);

  const classes = useMemo(() => ['All classes', ...new Set(records.map((record) => record.className))], [records]);
  const statuses = useMemo(() => ['All statuses', 'Present', 'Late', 'Absent', 'Pending', 'Excused'], []);
  const methods = useMemo(() => ['All methods', 'Face verification', 'Manual check-in', 'Not recorded'], []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClass = classFilter === 'All classes' || record.className === classFilter;
      const matchesStatus = statusFilter === 'All statuses' || record.status === statusFilter;
      const matchesMethod = methodFilter === 'All methods' || record.method === methodFilter;

      return matchesSearch && matchesClass && matchesStatus && matchesMethod;
    });
  }, [records, searchQuery, classFilter, statusFilter, methodFilter]);

  const chartValues = [82, 86, 90, 94, 92, 96];

  const handleStartCheckIn = () => {
    setCheckInState('verifying');
    setCheckInResult('');
    setAltCheckInConfirmed(false);
  };

  const handleSuccessfulMatch = () => {
    const currentTime = new Date();
    const formatted = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDemoRecordedAt(formatted);
    setCheckInState('verified');
    setCheckInResult(`Identity verified — demo only. ${selectedStudent.name} (${selectedStudent.id}) has been recorded for Class 3A.`);
  };

  const handleNoMatch = () => {
    setCheckInState('noMatch');
    setCheckInResult('Unable to verify identity in this demo. A failed match should not automatically count as an absence.');
  };

  const handleAlternateCheckIn = () => {
    setCheckInState('alternate');
    setCheckInResult('');
  };

  const handleAltSubmit = () => {
    const currentTime = new Date();
    const formatted = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDemoRecordedAt(formatted);
    setAltCheckInConfirmed(true);
    setCheckInState('completed');
    setCheckInResult(`Alternative check-in completed — demo only. ${selectedStudent.name} (${selectedStudent.id}) has been marked present with staff confirmation.`);
  };

  const handleResetDemo = () => {
    setSelectedStudentId('ST1024');
    setCheckInState('ready');
    setCheckInResult('');
    setAltCheckInConfirmed(false);
    setDemoRecordedAt('08:12 AM');
    setAltCheckInId('ST1031');
  };

  const handleStatusUpdate = (newStatus: StudentStatus) => {
    if (!selectedTableRecord) return;
    const previousStatus = selectedTableRecord.status;
    const reason = window.prompt(`Reason for change from ${previousStatus} to ${newStatus}?`, 'Review approved by admin');
    if (reason === null) return;

    setRecords((current) =>
      current.map((record) =>
        record.id === selectedTableRecord.id
          ? {
              ...record,
              status: newStatus,
              method: newStatus === 'Present' || newStatus === 'Late' ? 'Face verification' : 'Manual check-in',
              notes: `Updated by admin. Reason: ${reason}.`,
            }
          : record,
      ),
    );

    setAuditTrail((current) => [
      {
        id: Date.now(),
        admin: 'A. Lim',
        action: `${selectedTableRecord.name} moved from ${previousStatus} to ${newStatus}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...current,
    ]);
  };

  const handleExportCsv = () => {
    const csvHeaders = ['Name', 'Student ID', 'Class', 'Check-in', 'Status', 'Method', 'Notes'];
    const csvRows = filteredRecords.map((record) => [
      record.name,
      record.studentId,
      record.className,
      record.checkIn,
      record.status,
      record.method,
      record.notes,
    ]);

    const csvContent = [csvHeaders, ...csvRows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'facemark-demo-report.csv');
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  const resetDashboard = () => {
    if (!window.confirm('Reset the demo workspace back to the original sample records?')) return;
    setRecords(initialRecords);
    setSearchQuery('');
    setClassFilter('All classes');
    setStatusFilter('All statuses');
    setMethodFilter('All methods');
    setSelectedRecordId('1');
    setAuditTrail([
      { id: 1, admin: 'A. Lim', action: 'Class 3A session opened', time: '08:00 AM' },
      { id: 2, admin: 'R. Singh', action: 'Attendance report generated', time: '09:15 AM' },
      { id: 3, admin: 'K. Tan', action: 'Correction approved for Maya Lim', time: '09:35 AM' },
    ]);
    setExported(false);
  };

  const handleEnquiryFieldChange = (field: keyof InstitutionEnquiry, value: string | boolean) => {
    setEnquiryForm((prev) => ({ ...prev, [field]: value }));
    setEnquiryErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleInstitutionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors<InstitutionEnquiry> = {};

    if (!enquiryForm.fullName.trim()) nextErrors.fullName = 'Please enter your full name.';
    if (!enquiryForm.workEmail.trim()) {
      nextErrors.workEmail = 'Please enter your work email.';
    } else if (!validateEmail(enquiryForm.workEmail)) {
      nextErrors.workEmail = 'Please enter a valid email address.';
    }
    if (!enquiryForm.institutionName.trim()) nextErrors.institutionName = 'Please enter your institution name.';
    if (!enquiryForm.institutionType.trim()) nextErrors.institutionType = 'Please choose the institution type.';
    if (!enquiryForm.currentMethod.trim()) nextErrors.currentMethod = 'Please tell us your current attendance method.';
    if (!enquiryForm.consent) nextErrors.consent = 'Please confirm that you consent to follow-up.';

    setEnquiryErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setEnquirySuccess(false);
      return;
    }

    setEnquirySuccess(true);
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <a href="#top" className="brand" aria-label="FaceMark home">
            <LogoMark />
            <span>FaceMark</span>
          </a>

          <nav className="main-nav" aria-label="Main menu">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a href="#enquiry" className="button button-primary nav-button">
              Request a demo
            </a>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav-panel container" aria-label="Mobile menu">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#enquiry" className="button button-primary mobile-cta" onClick={() => setMobileMenuOpen(false)}>
              Request a demo
            </a>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">SMARTER ATTENDANCE FOR EDUCATION</p>
              <h1>Less time taking attendance. More time teaching.</h1>
              <p className="lede">
                FaceMark is a proposed attendance management platform that helps schools, colleges, and universities record check-ins, review attendance records, and manage class attendance from one clear dashboard.
              </p>
              <div className="cta-row">
                <a href="#product" className="button button-primary">
                  Try the live demo
                </a>
                <a href="#institutions" className="button button-secondary">
                  For schools and universities
                </a>
              </div>
              <p className="microcopy">
                Designed for educational institutions. Built around clear records, practical workflows, and responsible handling of student information.
              </p>
            </div>

            <div className="hero-panel">
              <div className="product-demo">
                <div className="demo-header">
                  <div>
                    <span className="demo-badge">Interactive product demo</span>
                    <p className="demo-title">Northbridge College</p>
                  </div>
                  <span className="status-pill status-good">Live session</span>
                </div>

                <div className="mini-dashboard">
                  <div className="session-meta">
                    <span>Class 3A</span>
                    <span>08:00 AM</span>
                  </div>

                  <div className="stats-row">
                    <div>
                      <small>Enrolled</small>
                      <strong>32</strong>
                    </div>
                    <div>
                      <small>Present</small>
                      <strong>26</strong>
                    </div>
                    <div>
                      <small>Late</small>
                      <strong>3</strong>
                    </div>
                    <div>
                      <small>Pending</small>
                      <strong>3</strong>
                    </div>
                  </div>

                  <div className="status-panel">
                    <div className="status-header">
                      <span>Session status</span>
                      <span className="pulse-dot" aria-hidden="true" />
                    </div>
                    <div className="checkin-summary">
                      <div className="face-box" aria-hidden="true">
                        <span>◉</span>
                      </div>
                      <div>
                        <strong>Identity verified</strong>
                        <p>Alex Tan · ST1024 · Present</p>
                      </div>
                    </div>
                  </div>

                  <div className="activity-feed">
                    <p>Activity</p>
                    <ul>
                      <li>Alex Tan checked in at 08:12 AM</li>
                      <li>Maya Lim marked late</li>
                      <li>3 attendance records pending review</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell problem-shell">
          <div className="container narrow">
            <div className="section-heading centered">
              <p className="eyebrow dark">Why this matters</p>
              <h2>Attendance should not interrupt the lesson.</h2>
              <p className="section-subhead">
                Recording who is present is essential, but the process does not need to become a separate administrative task every time a class begins.
              </p>
            </div>

            <div className="cards-grid three-up">
              {problemCards.map((card) => (
                <article key={card.title} className="info-card">
                  <div className="icon-box" aria-hidden="true">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell alt" id="how-it-works">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow dark">How FaceMark works</p>
              <h2>From check-in to attendance record.</h2>
              <p className="section-subhead">
                A clear process for students, teachers, and administrators.
              </p>
            </div>

            <div className="steps-grid">
              {processSteps.map((step, index) => (
                <div key={step.title} className="step-card">
                  <div className="step-number">0{index + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="step-visual">
                    {index === 0 && <div className="visual-frame"><span>Face verification</span></div>}
                    {index === 1 && <div className="visual-confirm"><span>Active session</span><strong>Alex Tan · ST1024</strong><small>08:12 AM</small></div>}
                    {index === 2 && <div className="visual-dashboard"><span>Present 26</span><span>Late 3</span><span>Pending 3</span></div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="cta-center">
              <a href="#product" className="button button-primary">
                Experience the check-in demo
              </a>
            </div>
          </div>
        </section>

        <section className="section-shell product-shell" id="product">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow dark">Check-in demo</p>
              <h2>See how a check-in could work.</h2>
              <p className="section-subhead">
                Explore a simulated attendance flow, from identity verification to a recorded check-in.
              </p>
            </div>

            <div className="demo-banner">
              This is a demonstration. It does not perform real facial recognition, access your camera, collect facial images, or create an official attendance record.
            </div>

            <div className="demo-grid">
              <div className="demo-panel camera-panel">
                <div className="panel-header">
                  <div>
                    <span className="panel-label">Institution</span>
                    <strong>Northbridge College</strong>
                  </div>
                  <div>
                    <span className="panel-label">Class</span>
                    <strong>Class 3A</strong>
                  </div>
                </div>

                <div className="camera-box">
                  <div className="camera-overlay" aria-hidden="true" />
                  <div className="camera-user">
                    <div className="camera-avatar">AT</div>
                  </div>
                  <div className="camera-status">{checkInState === 'ready' ? 'Ready to begin' : checkInState === 'verifying' ? 'Verifying identity...' : checkInState === 'verified' ? 'Identity verified' : checkInState === 'noMatch' ? 'Verification failed' : checkInState === 'alternate' ? 'Alternative method selected' : 'Check-in complete'}</div>
                </div>

                <div className="student-picker">
                  <label htmlFor="student-picker">Selected student</label>
                  <select id="student-picker" value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
                    {studentOptions.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} — {student.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="demo-actions">
                  <button type="button" className="button button-primary" onClick={handleStartCheckIn}>
                    Start check-in
                  </button>
                  <button type="button" className="button button-secondary" onClick={handleSuccessfulMatch}>
                    Simulate successful match
                  </button>
                  <button type="button" className="button button-secondary" onClick={handleNoMatch}>
                    Simulate no match
                  </button>
                  <button type="button" className="button button-secondary" onClick={handleAlternateCheckIn}>
                    Try another method
                  </button>
                  <button type="button" className="button button-ghost" onClick={handleResetDemo}>
                    Reset demo
                  </button>
                </div>
              </div>

              <div className="demo-panel result-panel">
                <div className="result-topline">
                  <span>Demo status</span>
                  <span className="status-pill status-neutral">Morning session</span>
                </div>

                <div className="result-card">
                  <p className="result-label">Selected student</p>
                  <h3>{selectedStudent.name}</h3>
                  <p className="result-meta">{selectedStudent.id} · Class 3A</p>
                  <div className="result-meta-row">
                    <span>Date</span>
                    <strong>18 Sep 2026</strong>
                  </div>
                  <div className="result-meta-row">
                    <span>Checked in</span>
                    <strong>{demoRecordedAt}</strong>
                  </div>
                </div>

                {checkInState === 'ready' && (
                  <div className="result-message neutral">
                    Select a student and begin the demonstration to preview the attendance flow.
                  </div>
                )}

                {checkInState === 'verifying' && (
                  <div className="result-message warning">
                    Verifying identity for {selectedStudent.name}.
                  </div>
                )}

                {checkInState === 'verified' && (
                  <div className="result-message success">
                    {checkInResult}
                  </div>
                )}

                {checkInState === 'noMatch' && (
                  <div className="result-message danger">
                    {checkInResult}
                    <div className="inline-actions">
                      <button type="button" className="button button-secondary" onClick={handleStartCheckIn}>Try again</button>
                      <button type="button" className="button button-primary" onClick={handleAlternateCheckIn}>Use alternative check-in</button>
                    </div>
                  </div>
                )}

                {checkInState === 'alternate' && (
                  <div className="alternate-panel">
                    <label htmlFor="alt-student-id">Alternative check-in</label>
                    <select id="alt-student-id" value={altCheckInId} onChange={(event) => setAltCheckInId(event.target.value)}>
                      {studentOptions.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} — {student.id}
                        </option>
                      ))}
                    </select>
                    <div className="alt-controls">
                      <label className="checkbox-row">
                        <input type="checkbox" checked={altCheckInConfirmed} onChange={(event) => setAltCheckInConfirmed(event.target.checked)} />
                        <span>Staff confirmation complete</span>
                      </label>
                    </div>
                    <button type="button" className="button button-primary wide" onClick={handleAltSubmit}>
                      Submit alternative check-in
                    </button>
                  </div>
                )}

                {checkInState === 'completed' && (
                  <div className="result-message success">
                    {checkInResult}
                    <div className="inline-actions">
                      <a href="#dashboard-demo" className="button button-primary">View attendance dashboard</a>
                    </div>
                  </div>
                )}

                <div className="policy-note">
                  An attendance system needs more than a successful face match. It also needs clear records, exception handling, and a way to correct mistakes.
                </div>

                <a href="#dashboard-demo" className="button button-primary wide margin-top">
                  Explore the dashboard
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell dashboard-shell" id="dashboard-demo">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow dark">Dashboard demo</p>
              <h2>Centralised attendance management.</h2>
            </div>

            <div className="dashboard-layout">
              <aside className="sidebar">
                <div className="sidebar-brand">
                  <LogoMark light />
                  <span>FaceMark</span>
                </div>
                <ul className="sidebar-nav">
                  <li className="active">Attendance</li>
                  <li>Students</li>
                  <li>Reports</li>
                  <li>Settings</li>
                </ul>
                <div className="sidebar-card">
                  <p>Demo workspace</p>
                  <strong>Sample data only</strong>
                </div>
              </aside>

              <div className="dashboard-main">
                <div className="dashboard-topbar">
                  <div>
                    <span className="panel-label">Institution</span>
                    <strong>Northbridge College</strong>
                  </div>
                  <div>
                    <span className="panel-label">Session</span>
                    <strong>Morning attendance</strong>
                  </div>
                  <div className="admin-pill">A. Lee</div>
                </div>

                <div className="summary-grid">
                  <div className="summary-card">
                    <span>Total enrolled</span>
                    <strong>{summary.total}</strong>
                  </div>
                  <div className="summary-card success">
                    <span>Present</span>
                    <strong>{summary.present}</strong>
                  </div>
                  <div className="summary-card warning">
                    <span>Late</span>
                    <strong>{summary.late}</strong>
                  </div>
                  <div className="summary-card danger">
                    <span>Absent</span>
                    <strong>{summary.absent}</strong>
                  </div>
                  <div className="summary-card neutral">
                    <span>Pending</span>
                    <strong>{summary.pending}</strong>
                  </div>
                </div>

                <div className="chart-panel">
                  <div className="panel-head-row">
                    <h3>Attendance trend</h3>
                    <span>Illustrative attendance data for demonstration purposes.</span>
                  </div>
                  <div className="bar-chart" aria-label="Attendance trends chart">
                    {chartValues.map((value, index) => (
                      <div key={index} className="bar-col">
                        <span className="bar-value">{value}%</span>
                        <div className="bar" style={{ height: `${value}%` }} />
                        <small>Mon</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="table-panel">
                  <div className="table-controls">
                    <div className="control-group search-group">
                      <label htmlFor="search-student">Search</label>
                      <input
                        id="search-student"
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by student name or ID"
                      />
                    </div>

                    <div className="control-group">
                      <label htmlFor="class-filter">Class</label>
                      <select id="class-filter" value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
                        {classes.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="status-filter">Status</label>
                      <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                        {statuses.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="method-filter">Method</label>
                      <select id="method-filter" value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)}>
                        {methods.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button type="button" className="button button-secondary small-button" onClick={() => {
                      setSearchQuery('');
                      setClassFilter('All classes');
                      setStatusFilter('All statuses');
                      setMethodFilter('All methods');
                    }}>
                      Reset filters
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Student ID</th>
                          <th>Class</th>
                          <th>Check-in</th>
                          <th>Status</th>
                          <th>Method</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.length > 0 ? (
                          filteredRecords.map((record) => (
                            <tr key={record.id} onClick={() => setSelectedRecordId(record.id)} className={record.id === selectedTableRecord?.id ? 'selected-row' : ''}>
                              <td>{record.name}</td>
                              <td>{record.studentId}</td>
                              <td>{record.className}</td>
                              <td>{record.checkIn}</td>
                              <td><span className={`status-badge status-${record.status.toLowerCase()}`}>{record.status}</span></td>
                              <td>{record.method}</td>
                              <td><button type="button" className="table-action" onClick={() => setSelectedRecordId(record.id)}>View details</button></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7}>
                              <div className="empty-state">No attendance records match the current filters.</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bottom-grid">
                  <div className="activity-panel">
                    <div className="panel-head-row">
                      <h3>Recent activity</h3>
                    </div>
                    <ul className="activity-list">
                      {auditTrail.map((item) => (
                        <li key={item.id}>
                          <span>{item.action}</span>
                          <small>{item.admin} · {item.time}</small>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-panel">
                    <div className="panel-head-row">
                      <h3>Record details</h3>
                      <button type="button" className="button button-secondary small-button" onClick={() => handleStatusUpdate('Present')}>
                        Mark present
                      </button>
                    </div>

                    {selectedTableRecord && (
                      <div className="detail-content">
                        <div className="detail-row">
                          <span>Student</span>
                          <strong>{selectedTableRecord.name}</strong>
                        </div>
                        <div className="detail-row">
                          <span>ID</span>
                          <strong>{selectedTableRecord.studentId}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Class</span>
                          <strong>{selectedTableRecord.className}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Current status</span>
                          <strong>{selectedTableRecord.status}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Method</span>
                          <strong>{selectedTableRecord.method}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Notes</span>
                          <strong>{selectedTableRecord.notes}</strong>
                        </div>
                        <div className="status-actions">
                          <button type="button" className="button button-secondary" onClick={() => handleStatusUpdate('Present')}>Present</button>
                          <button type="button" className="button button-secondary" onClick={() => handleStatusUpdate('Late')}>Late</button>
                          <button type="button" className="button button-secondary" onClick={() => handleStatusUpdate('Absent')}>Absent</button>
                          <button type="button" className="button button-secondary" onClick={() => handleStatusUpdate('Excused')}>Excused</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="report-bar">
                  <button type="button" className="button button-primary" onClick={handleExportCsv}>
                    Export report
                  </button>
                  <button type="button" className="button button-secondary" onClick={resetDashboard}>
                    Reset demo data
                  </button>
                  {exported && <span className="success-inline">CSV export generated from the demo data.</span>}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell feature-shell">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow dark">Features</p>
              <h2>Everything attendance management needs. Nothing unnecessarily complicated.</h2>
              <p className="section-subhead">
                Bring daily check-ins, attendance records, and administrative review into one organised workflow.
              </p>
            </div>

            <div className="feature-grid">
              {featureCards.map((feature) => (
                <article key={feature.title} className="feature-card">
                  <div className="feature-icon" aria-hidden="true">✓</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell alt" id="institutions">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow dark">Institution use cases</p>
              <h2>Designed for the way educational institutions work.</h2>
            </div>

            <div className="usecase-grid">
              {institutionCards.map((card) => (
                <article key={card.title} className="usecase-card">
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell privacy-shell" id="privacy">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow dark">Privacy and responsible use</p>
              <h2>Attendance technology should earn trust.</h2>
              <p className="section-subhead">
                Facial recognition involves sensitive personal information. Any real deployment must be designed around transparency, appropriate safeguards, and the institution's legal obligations.
              </p>
            </div>

            <div className="privacy-grid">
              {privacyCards.map((card) => (
                <article key={card.title} className="privacy-card">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>

            <div className="privacy-note-box">
              <h3>Built around responsible implementation.</h3>
              <p>
                An actual deployment would require assessment of applicable data protection obligations in Singapore, whether biometric processing is necessary and proportionate, appropriate notices and consent or other valid legal grounds, additional safeguards for children and young people, data retention and deletion, security of any biometric templates, access control and audit logging, false matches and failed matches, bias and performance differences across demographic groups, manual review and appeals, accessibility and alternative attendance methods, vendor and third-party data processing, and incident response and breach management.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell implementation-shell">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow dark">Implementation</p>
              <h2>Start with your attendance workflow.</h2>
              <p className="section-subhead">
                Every institution has different attendance policies, class structures, and IT requirements. A deployment should begin by understanding those needs.
              </p>
            </div>

            <div className="implementation-grid">
              {implementationSteps.map((step, index) => (
                <div key={step} className="implementation-card">
                  <div className="step-tag">0{index + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <div className="cta-center">
              <a href="#enquiry" className="button button-primary">
                Discuss an institutional pilot
              </a>
            </div>
          </div>
        </section>

        <section className="section-shell enquiry-shell" id="enquiry">
          <div className="container enquiry-grid">
            <div className="enquiry-copy">
              <p className="eyebrow dark">Institution enquiry</p>
              <h2>Explore a better way to manage attendance.</h2>
              <p>
                Tell us about your institution and the attendance challenges you want to solve.
              </p>
            </div>

            <form className="enquiry-form" onSubmit={handleInstitutionSubmit} noValidate>
              <div className="field-grid two-col">
                <div className="field-row">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={enquiryForm.fullName}
                    onChange={(event) => handleEnquiryFieldChange('fullName', event.target.value)}
                    aria-invalid={Boolean(enquiryErrors.fullName)}
                  />
                  {enquiryErrors.fullName && <span className="field-error">{enquiryErrors.fullName}</span>}
                </div>

                <div className="field-row">
                  <label htmlFor="workEmail">Work email</label>
                  <input
                    id="workEmail"
                    type="email"
                    value={enquiryForm.workEmail}
                    onChange={(event) => handleEnquiryFieldChange('workEmail', event.target.value)}
                    aria-invalid={Boolean(enquiryErrors.workEmail)}
                  />
                  {enquiryErrors.workEmail && <span className="field-error">{enquiryErrors.workEmail}</span>}
                </div>
              </div>

              <div className="field-grid two-col">
                <div className="field-row">
                  <label htmlFor="institutionName">Institution name</label>
                  <input
                    id="institutionName"
                    type="text"
                    value={enquiryForm.institutionName}
                    onChange={(event) => handleEnquiryFieldChange('institutionName', event.target.value)}
                    aria-invalid={Boolean(enquiryErrors.institutionName)}
                  />
                  {enquiryErrors.institutionName && <span className="field-error">{enquiryErrors.institutionName}</span>}
                </div>

                <div className="field-row">
                  <label htmlFor="institutionType">Institution type</label>
                  <select
                    id="institutionType"
                    value={enquiryForm.institutionType}
                    onChange={(event) => handleEnquiryFieldChange('institutionType', event.target.value)}
                    aria-invalid={Boolean(enquiryErrors.institutionType)}
                  >
                    <option value="">Select</option>
                    <option value="Secondary school">Secondary school</option>
                    <option value="Junior college">Junior college</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="Private educational institution">Private educational institution</option>
                    <option value="University">University</option>
                    <option value="Other">Other</option>
                  </select>
                  {enquiryErrors.institutionType && <span className="field-error">{enquiryErrors.institutionType}</span>}
                </div>
              </div>

              <div className="field-grid two-col">
                <div className="field-row">
                  <label htmlFor="jobTitle">Job title or department</label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={enquiryForm.jobTitle}
                    onChange={(event) => handleEnquiryFieldChange('jobTitle', event.target.value)}
                  />
                </div>

                <div className="field-row">
                  <label htmlFor="studentPopulation">Approximate student population</label>
                  <input
                    id="studentPopulation"
                    type="text"
                    value={enquiryForm.studentPopulation}
                    onChange={(event) => handleEnquiryFieldChange('studentPopulation', event.target.value)}
                  />
                </div>
              </div>

              <div className="field-grid two-col">
                <div className="field-row">
                  <label htmlFor="currentMethod">Current attendance method</label>
                  <select
                    id="currentMethod"
                    value={enquiryForm.currentMethod}
                    onChange={(event) => handleEnquiryFieldChange('currentMethod', event.target.value)}
                    aria-invalid={Boolean(enquiryErrors.currentMethod)}
                  >
                    <option value="">Select</option>
                    <option value="Manual register">Manual register</option>
                    <option value="Spreadsheet">Spreadsheet</option>
                    <option value="QR code">QR code</option>
                    <option value="Existing attendance software">Existing attendance software</option>
                    <option value="Other">Other</option>
                  </select>
                  {enquiryErrors.currentMethod && <span className="field-error">{enquiryErrors.currentMethod}</span>}
                </div>

                <div className="field-row">
                  <label htmlFor="preferredFollowUp">Preferred follow-up method</label>
                  <select
                    id="preferredFollowUp"
                    value={enquiryForm.preferredFollowUp}
                    onChange={(event) => handleEnquiryFieldChange('preferredFollowUp', event.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Email">Email</option>
                    <option value="Video call">Video call</option>
                    <option value="Phone call">Phone call</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <label htmlFor="mainChallenge">Main challenge</label>
                <textarea
                  id="mainChallenge"
                  rows={4}
                  value={enquiryForm.mainChallenge}
                  onChange={(event) => handleEnquiryFieldChange('mainChallenge', event.target.value)}
                />
              </div>

              <label className="checkbox-row">
                <input type="checkbox" checked={enquiryForm.consent} onChange={(event) => handleEnquiryFieldChange('consent', event.target.checked)} />
                <span>I agree to be contacted about a potential institutional pilot.</span>
              </label>
              {enquiryErrors.consent && <span className="field-error">{enquiryErrors.consent}</span>}

              <button type="submit" className="button button-primary wide">
                Request a demo
              </button>

              {enquirySuccess && (
                <p className="success-message" aria-live="polite">
                  This demo form has been validated locally. Your enquiry has not been sent or saved.
                </p>
              )}
            </form>
          </div>
        </section>

        <section className="section-shell faq-shell" id="faq">
          <div className="container faq-wrap">
            <div className="section-heading centered">
              <p className="eyebrow dark">FAQ</p>
              <h2>Common questions</h2>
            </div>

            <div className="faq-list" role="list">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button type="button" className="faq-question" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)}>
                      <span>{item.question}</span>
                      <span className="faq-indicator">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && <p className="faq-answer">{item.answer}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#top" className="brand footer-brand-link" aria-label="FaceMark home">
              <LogoMark light />
              <span>FaceMark</span>
            </a>
            <p className="tagline">Attendance, without the roll call.</p>
            <p className="footer-copy">A proposed attendance management platform for schools, colleges, and universities.</p>
          </div>

          <div className="footer-links">
            <a href="#product">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#institutions">Institution use cases</a>
            <a href="#privacy">Privacy</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer-links">
            <a href="#enquiry">Request a demo</a>
            <a href="#privacy">Privacy Policy (draft)</a>
            <a href="#privacy">Terms of Use (draft)</a>
          </div>
        </div>

        <div className="container legal-row">
          <p>© {new Date().getFullYear()} FaceMark. Product concept and interactive demo for institutional evaluation.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
