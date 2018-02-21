export class Medium {
    public static get(cacheCount: number, slotCount: number, backupCountSinceStart: number): Medium {
        let cacheInterval = slotCount * slotCount;  // How many backups to move from one to the next cache
        let cacheCycle = cacheCount * cacheInterval;  // How many backups to cycle through all caches
        let slotStartInterval = cacheCycle + slotCount + 1; // How many backups between two slot starts
        let mediaLifetime = cacheCycle * slotCount; // How many backups before a single medium is retired
        // The last number is the *total* amount of backups that are made during the lifetime of a single medium and is
        // not to be confused with how many times a single medium is written to.

        // When the backup starts with the very first medium, we want to begin retiring media after one full
        // cache cycle. The following addition takes care of this fact. Moreover it also ensures that
        // backupsSinceSlotStart will never become negative
        backupCountSinceStart += mediaLifetime - cacheCycle + cacheInterval - slotCount;

        let slotNumber = (backupCountSinceStart % slotCount);
        let backupCountSinceSlotStart = backupCountSinceStart - slotNumber * slotStartInterval;
        let cacheNumber = Math.floor(backupCountSinceSlotStart / cacheInterval) % cacheCount;
        let backupCountSinceMediumStart = backupCountSinceSlotStart % mediaLifetime - cacheNumber * cacheInterval;

        return new Medium(
            cacheNumber,
            slotNumber,
            Math.floor(backupCountSinceSlotStart / mediaLifetime),
            backupCountSinceMediumStart,
            mediaLifetime - backupCountSinceMediumStart - (cacheCount - 1) * cacheInterval - slotCount);
    }

    private constructor(
        public readonly cacheNumber: number,
        public readonly slotNumber: number,
        public readonly serialNumber: number,
        public readonly backupCountSinceMediumStart: number,
        public readonly backupCountUntilMediumEnd: number)
    {       
    }
}