class Job {
    Status;
    constructor(JobID, UserID, Role, Company, DateApplied, Location, StatusID) {
        Object.assign(this, { JobID, UserID, Role, Company, DateApplied, Location, StatusID });
        this.Status = this.setStatus(StatusID)
    }

    setStatus(StatusID) {
        switch (StatusID) {
            case 0: return 'Applied'
            case 1: return 'Interview'
            case 2: return 'Offer'
            case 3: return 'Accepted'
            case 4: return 'Rejected'
            case 4: return 'Declined'
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