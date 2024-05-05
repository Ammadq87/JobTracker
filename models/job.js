class Job {
    Status;
    constructor(JobID, UserID, Role, Company, DateApplied, Location, StatusID) {
        Object.assign(this, { JobID, UserID, Role, Company, DateApplied, Location, StatusID });
        this.Status = this.setStatus(StatusID)
    }

    setStatusID(id) {
        this.StatusID = id
    }

    setStatus(StatusID) {
        switch (StatusID) {
            case 0: this.Status = 'Applied'; break;
            case 1: this.Status = 'Interview'; break;
            case 2: this.Status = 'Offer'; break;
            case 3: this.Status = 'Accepted'; break;
            case 4: this.Status = 'Rejected'; break;
            case 5: this.Status = 'Declined'; break;
        }
    }

    getStatusIdFromDesc(desc) {
        switch (desc) {
            case 'Applied': return 0
            case 'Interview': return 1 
            case 'Offer': return 2
            case 'Accepted': return 3
            case 'Rejected': return 4
            case 'Declined': return 5
        }
    }

    /**
     * Converts JSON job object to Job Object
     * @param {JSON} jsonObj 
     * @returns 
     */
    static fromJSON(jsonObj) {
        const { JobID, UserID, Role, Company, DateApplied, Location, StatusID } = jsonObj;
        return new Job(JobID, UserID, Role, Company, DateApplied, Location, StatusID);
    }
}

module.exports = Job