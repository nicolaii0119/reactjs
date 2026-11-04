import { QRCodeSVG } from "qrcode.react";

type EmployeeQRCodeProps = {
employeeId: string;
employeeName?: string;
};

function EmployeeQRCode({
employeeId,
employeeName,
}: EmployeeQRCodeProps) {
if (!employeeId) {
return <p className="text-danger">Employee ID is required.</p>;
}


return (
    <div className="card border-0 shadow-sm p-4 text-center">
        <h5 className="mb-3">Employee QR Code</h5>

        {employeeName && (
            <p className="mb-3">{employeeName}</p>
        )}

        <div className="d-flex justify-content-center">
            <QRCodeSVG
                value={employeeId}
                size={220}
                level="H"
                includeMargin
            />
        </div>

        <p className="mt-3 mb-2">
            <strong>Employee ID:</strong> {employeeId}
        </p>

        <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => window.print()}
        >
            Print QR Code
        </button>
    </div>
);


}

export default EmployeeQRCode;
