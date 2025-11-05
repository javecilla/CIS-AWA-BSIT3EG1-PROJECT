import './AppointmentHistory.css';

function AppointmentHistory({totalRecords, displayedRecords}) {
    return (
        <>
        <div className="appointment-top-section d-flex flex-row justify-content-between flex-wrap">
            <div className="appointment-history">
                <h3>Your Appointment History</h3>
                <p>Showing all your past and upcoming visits</p>
            </div>
            <div className="download-records mt-3 mt-md-0">
                <button className="btn btn-primary custom-btn">Download my Records</button>
            </div>
        </div>

        <div className="appointment-table">
            <div className="table-responsive">
            <table className="table">
                <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Branch</th>
                    <th>Reason / Dose</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="5" className="text-center">
                        No appointment history record found
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>

        <div className="appointment-bottom-section d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="record-text text-center text-md-start">
                <p>Showing {displayedRecords} records out of {totalRecords}</p>
            </div>
            <div className="appointment-button-container d-flex gap-3">
                <button className="btn btn-outline-primary custom-btn-outline">Previous</button>
                <button className="btn btn-primary custom-btn">Next</button>
            </div>
        </div>
        </>
    )
}

export default AppointmentHistory;