
import { useCallback, useEffect, useRef, useState } from "react";

type AttendanceRecord = {
  Attendance_ID?: number;
  Employee_ID: string;
  First_Name: string;
  Middle_Name?: string | null;
  Last_Name: string;
  Attendance_Date?: string;
  Time_In?: string | null;
  Time_Out?: string | null;
  Attendance_Status?: string | null;
};

type ScanResult = {
  success: boolean;
  action?: string;
  message?: string;
  detail?: string;
  employee?: {
    Employee_ID: string;
    First_Name: string;
    Middle_Name?: string | null;
    Last_Name: string;
    Department?: string | null;
    Position?: string | null;
  };
  time_in?: string | null;
  time_out?: string | null;
  attendance_status?: string | null;
};

const API_URL = "http://127.0.0.1:8000";

function formatTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(
    value.includes("T") ? value : `1970-01-01T${value}`
  );

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [rfidUid, setRfidUid] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const loadAttendance = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/attendance/today`);

      if (!response.ok) {
        throw new Error("Unable to load attendance.");
      }

      const data = await response.json();

      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Cannot connect to the attendance server.");
      setIsSuccess(false);
    }
  }, []);

  useEffect(() => {
    const clockInterval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    loadAttendance();

    const attendanceInterval = window.setInterval(() => {
      loadAttendance();
    }, 30000);

    return () => {
      window.clearInterval(clockInterval);
      window.clearInterval(attendanceInterval);
    };
  }, [loadAttendance]);

  const handleScan = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const uid = rfidUid.trim();

    if (!uid || processingRef.current) return;

    processingRef.current = true;
    setIsScanning(true);
    setMessage("Processing RFID card...");
    setIsSuccess(false);
    setRfidUid("");

    try {
      const response = await fetch(`${API_URL}/attendance/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rfid_uid: uid,
        }),
      });

      const result: ScanResult = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            result.message ||
            "Failed to record attendance."
        );
      }

      setMessage(
        result.message || "Attendance processed successfully."
      );

      setIsSuccess(result.success);

      await loadAttendance();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to process RFID scan."
      );

      setIsSuccess(false);
    } finally {
      processingRef.current = false;
      setIsScanning(false);

      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const filteredRecords = records.filter((record) => {
    const fullName = [
      record.First_Name,
      record.Middle_Name ?? "",
      record.Last_Name,
    ]
      .join(" ")
      .toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      record.Employee_ID.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getFullName = (record: AttendanceRecord) =>
    [
      record.First_Name,
      record.Middle_Name ?? "",
      record.Last_Name,
    ]
      .filter(Boolean)
      .join(" ");

  const getStatusStyle = (status?: string | null) => {
    const normalizedStatus = (status || "Present").toLowerCase();

    if (normalizedStatus === "late") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (normalizedStatus === "absent") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#dcfce7",
      color: "#166534",
    };
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>HR Attendance System</h1>
          <p style={styles.subheading}>
            RFID Employee Attendance Station
          </p>
        </div>

        <div style={styles.clock}>
          <div style={styles.time}>
            {now.toLocaleTimeString("en-PH", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "Asia/Manila",
            })}
          </div>

          <div style={styles.date}>
            {now.toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Manila",
            })}
          </div>
        </div>
      </header>

      <section style={styles.mainGrid}>
        <div style={styles.scanCard}>
          <div style={styles.rfidIcon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="15" width="34" height="34" rx="5" />
              <path d="M15 25h14M15 32h14M15 39h8" />
              <path d="M45 22c7 6 7 14 0 20" />
              <path d="M51 16c11 9 11 23 0 32" />
            </svg>
          </div>

          <h2 style={styles.sectionHeading}>RFID Scanner</h2>

          <p style={styles.description}>
            Tap your registered RFID card on the reader.
          </p>

          <div style={styles.readerStatus}>
            <span
              style={{
                ...styles.statusDot,
                background: isScanning ? "#f59e0b" : "#22c55e",
              }}
            />

            {isScanning ? "Processing card..." : "Ready to scan"}
          </div>

          <form onSubmit={handleScan} style={styles.form}>
            <label htmlFor="rfidUid" style={styles.inputLabel}>
              RFID UID
            </label>

            <input
              id="rfidUid"
              ref={inputRef}
              type="text"
              value={rfidUid}
              onChange={(event) => setRfidUid(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Tap card or enter RFID UID"
              autoComplete="off"
              autoFocus
              style={styles.input}
              disabled={isScanning}
            />

            <button
              type="submit"
              style={{
                ...styles.scanButton,
                opacity: isScanning || !rfidUid.trim() ? 0.6 : 1,
              }}
              disabled={isScanning || !rfidUid.trim()}
            >
              {isScanning ? "Processing..." : "Record Attendance"}
            </button>
          </form>

          <p style={styles.hint}>
            First tap records Time In. Second tap records Time Out.
          </p>

          {message && (
            <div
              role="status"
              style={{
                ...styles.message,
                ...(isSuccess ? styles.success : styles.error),
              }}
            >
              {message}
            </div>
          )}
        </div>

        <div style={styles.employeeCard}>
          <div style={styles.employeeHeader}>
            <div>
              <h2 style={styles.sectionHeading}>
                Employee Attendance
              </h2>

              <p style={styles.description}>
                Today's attendance records
              </p>
            </div>

            <div style={styles.totalBadge}>
              {filteredRecords.length} Records
            </div>
          </div>

          <div style={styles.summaryGrid}>
            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Present</span>

              <strong style={styles.summaryNumber}>
                {
                  records.filter(
                    (record) =>
                      (
                        record.Attendance_Status || "Present"
                      ).toLowerCase() === "present"
                  ).length
                }
              </strong>
            </div>

            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Late</span>

              <strong style={styles.summaryNumber}>
                {
                  records.filter(
                    (record) =>
                      (
                        record.Attendance_Status || ""
                      ).toLowerCase() === "late"
                  ).length
                }
              </strong>
            </div>

            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Timed Out</span>

              <strong style={styles.summaryNumber}>
                {records.filter((record) => !!record.Time_Out).length}
              </strong>
            </div>
          </div>

          <input
            type="search"
            placeholder="Search employee ID or name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Time In</th>
                  <th style={styles.th}>Time Out</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <tr
                      key={
                        record.Attendance_ID ??
                        `${record.Employee_ID}-${index}`
                      }
                    >
                      <td style={styles.td}>
                        <div style={styles.employeeName}>
                          {getFullName(record)}
                        </div>

                        <div style={styles.employeeId}>
                          {record.Employee_ID}
                        </div>
                      </td>

                      <td style={styles.td}>
                        {formatTime(record.Time_In)}
                      </td>

                      <td style={styles.td}>
                        {formatTime(record.Time_Out)}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            ...getStatusStyle(
                              record.Attendance_Status
                            ),
                          }}
                        >
                          {record.Attendance_Status || "Present"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={styles.empty}>
                      {search
                        ? "No matching employee records found."
                        : "No attendance records found for today."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={loadAttendance}
            style={styles.refreshButton}
          >
            Refresh Attendance
          </button>
        </div>
      </section>

      <footer style={styles.footer}>
        HR Attendance System · RFID Attendance Station
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5f3ff",
    padding: "28px",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "26px",
  },

  heading: {
    margin: 0,
    fontSize: "28px",
    color: "#4c1d95",
  },

  subheading: {
    margin: "8px 0 0",
    color: "#6b7280",
  },

  clock: {
    textAlign: "right",
  },

  time: {
    fontSize: "25px",
    fontWeight: 700,
    color: "#4c1d95",
  },

  date: {
    marginTop: "5px",
    color: "#6b7280",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 0.8fr) minmax(0, 1.7fr)",
    alignItems: "start",
    gap: "24px",
  },

  scanCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "28px 22px",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(31, 41, 55, 0.06)",
    border: "1px solid #ede9fe",
    boxSizing: "border-box",
  },

  rfidIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100px",
    width: "100px",
    borderRadius: "18px",
    background: "#ede9fe",
    color: "#6d28d9",
    margin: "0 auto 18px",
  },

  sectionHeading: {
    margin: "0 0 8px",
    fontSize: "20px",
    color: "#312e81",
  },

  description: {
    margin: "0 0 18px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  readerStatus: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    background: "#f5f3ff",
    borderRadius: "8px",
    color: "#4c1d95",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "22px",
  },

  statusDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    display: "inline-block",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textAlign: "left",
  },

  inputLabel: {
    color: "#374151",
    fontWeight: 600,
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 12px",
    border: "1px solid #c4b5fd",
    borderRadius: "8px",
    fontSize: "14px",
    outlineColor: "#7c3aed",
  },

  scanButton: {
    width: "100%",
    padding: "13px 15px",
    background: "#6d28d9",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  hint: {
    margin: "18px 0 0",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: 1.6,
  },

  message: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  employeeCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 16px rgba(31, 41, 55, 0.06)",
    border: "1px solid #ede9fe",
    minWidth: 0,
    boxSizing: "border-box",
  },

  employeeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap",
  },

  totalBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#ede9fe",
    color: "#5b21b6",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
    margin: "8px 0 18px",
  },

  summaryBox: {
    background: "#f5f3ff",
    padding: "13px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  summaryLabel: {
    color: "#6b7280",
    fontSize: "12px",
  },

  summaryNumber: {
    color: "#4c1d95",
    fontSize: "22px",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    padding: "13px 10px",
    background: "#f5f3ff",
    color: "#4c1d95",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "13px 10px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  employeeName: {
    color: "#1f2937",
    fontWeight: 600,
    marginBottom: "4px",
  },

  employeeId: {
    color: "#6b7280",
    fontSize: "11px",
  },

  status: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  empty: {
    textAlign: "center",
    padding: "28px 12px",
    color: "#6b7280",
    fontSize: "13px",
  },

  refreshButton: {
    marginTop: "16px",
    padding: "10px 14px",
    background: "#ffffff",
    color: "#5b21b6",
    border: "1px solid #c4b5fd",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "12px",
    padding: "24px 0 4px",
  },
};
