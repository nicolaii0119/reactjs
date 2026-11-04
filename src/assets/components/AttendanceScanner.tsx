import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ScanResult = {
success?: boolean;
message?: string;
employee?: {
Employee_ID?: string;
First_Name?: string;
Last_Name?: string;
};
employee_name?: string;
action?: string;
time?: string;
};

function AttendanceScanner() {
const scannerRef = useRef<Html5Qrcode | null>(null);
const processingRef = useRef(false);
const [message, setMessage] = useState("Ready to scan employee QR code.");
const [loading, setLoading] = useState(false);
const [scannerStarted, setScannerStarted] = useState(false);
const [lastResult, setLastResult] = useState<ScanResult | null>(null);


useEffect(() => {
    let mounted = true;
    let scanner: Html5Qrcode | null = null;

    const startScanner = async () => {
        try {
            scanner = new Html5Qrcode("attendance-qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedText) => {
                    if (processingRef.current) return;

                    processingRef.current = true;
                    setLoading(true);
                    setMessage("Processing attendance...");

                    try {
                        await scanner?.pause(true);

                        const response = await fetch(
                            "http://127.0.0.1:8000/attendance/scan",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    qr_code: decodedText,
                                }),
                            }
                        );

                        const data: ScanResult = await response.json();

                        if (!response.ok || data.success === false) {
                            throw new Error(
                                data.message || "Attendance scan failed."
                            );
                        }

                        if (!mounted) return;

                        setLastResult(data);
                        setMessage(
                            data.message || "Attendance recorded successfully."
                        );
                    } catch (error) {
                        if (mounted) {
                            setMessage(
                                error instanceof Error
                                    ? error.message
                                    : "Unable to record attendance."
                            );
                        }
                    } finally {
                        if (mounted) {
                            setLoading(false);

                            window.setTimeout(() => {
                                processingRef.current = false;

                                try {
                                    if (scanner?.isScanning) {
                                        scanner.resume();
                                    }
                                } catch {
                                    setMessage("Please refresh the page to scan again.");
                                }
                            }, 2500);
                        }
                    }
                },
                () => {}
            );

            if (mounted) {
                setScannerStarted(true);
                setMessage("Camera ready. Scan your employee QR code.");
            }
        } catch {
            if (mounted) {
                setMessage(
                    "Camera unavailable. Allow camera permission and use localhost or HTTPS."
                );
            }
        }
    };

    void startScanner();

    return () => {
        mounted = false;
        const activeScanner = scanner;

        if (activeScanner) {
            void (async () => {
                try {
                    if (activeScanner.isScanning) {
                        await activeScanner.stop();
                    }
                } catch {
                    // Camera may already be stopped.
                }

                try {
                    activeScanner.clear();
                } catch {
                    // Scanner may already be cleared.
                }
            })();
        }

        scannerRef.current = null;
    };
}, []);

return (
    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9">
                <div className="card border-0 shadow rounded-4">
                    <div
                        className="card-header text-white p-4 rounded-top-4"
                        style={{
                            background:
                                "linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)",
                        }}
                    >
                        <h3 className="mb-1">Attendance QR Scanner</h3>
                        <p className="mb-0">
                            Scan your employee QR code to record attendance.
                        </p>
                    </div>

                    <div className="card-body p-4">
                        <div id="attendance-qr-reader" />

                        <div className="alert alert-info mt-3 mb-3">
                            {loading ? "Processing..." : message}
                        </div>

                        {lastResult && (
                            <div className="border rounded-3 p-3">
                                <h5 className="mb-2">Latest Scan</h5>

                                {lastResult.employee && (
                                    <p className="mb-1">
                                        <strong>Employee:</strong>{" "}
                                        {lastResult.employee.First_Name}{" "}
                                        {lastResult.employee.Last_Name}
                                    </p>
                                )}

                                {lastResult.employee?.Employee_ID && (
                                    <p className="mb-1">
                                        <strong>Employee ID:</strong>{" "}
                                        {lastResult.employee.Employee_ID}
                                    </p>
                                )}

                                {lastResult.employee_name && (
                                    <p className="mb-1">
                                        <strong>Employee:</strong>{" "}
                                        {lastResult.employee_name}
                                    </p>
                                )}

                                {lastResult.action && (
                                    <p className="mb-1">
                                        <strong>Action:</strong>{" "}
                                        {lastResult.action}
                                    </p>
                                )}

                                {lastResult.time && (
                                    <p className="mb-0">
                                        <strong>Time:</strong>{" "}
                                        {lastResult.time}
                                    </p>
                                )}
                            </div>
                        )}

                        {!scannerStarted && !loading && (
                            <p className="text-muted small mt-3 mb-0">
                                Make sure camera permission is enabled.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);


}

export default AttendanceScanner;
