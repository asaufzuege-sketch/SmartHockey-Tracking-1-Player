// LocalStorage Verwaltung (Team-spezifisch)
App.storage = {
  prefix: 's1player_',
  
  // Aktuelle Team-ID ermitteln
  getCurrentTeamId() {
    return App.data.currentTeam || "team1";
  },
  
  // Teamspezifische Storage Keys mit App-Prefix
  getTeamStorageKey(key) {
    return `${this.prefix}${key}_${this.getCurrentTeamId()}`;
  },
  
  // Wrapper-Funktionen für localStorage mit Prefix
  getItem(key) {
    return localStorage.getItem(this.prefix + key);
  },
  
  setItem(key, value) {
    localStorage.setItem(this.prefix + key, value);
  },
  
  removeItem(key) {
    localStorage.removeItem(this.prefix + key);
  },
  
  load() {
    const teamId = this.getCurrentTeamId();
    App.data.selectedPlayers = JSON.parse(this.getItem(`selectedPlayers_${teamId}`)) || [];
    App.data.statsData = JSON.parse(this.getItem(`statsData_${teamId}`)) || {};
    App.data.playerTimes = JSON.parse(this.getItem(`playerTimes_${teamId}`)) || {};
    App.data.seasonData = JSON.parse(this.getItem(`seasonData_${teamId}`)) || {};
  },
  
  saveSelectedPlayers() {
    const teamId = this.getCurrentTeamId();
    this.setItem(`selectedPlayers_${teamId}`, JSON.stringify(App.data.selectedPlayers));
  },
  
  saveStatsData() {
    const teamId = this.getCurrentTeamId();
    this.setItem(`statsData_${teamId}`, JSON.stringify(App.data.statsData));
  },
  
  savePlayerTimes() {
    const teamId = this.getCurrentTeamId();
    this.setItem(`playerTimes_${teamId}`, JSON.stringify(App.data.playerTimes));
  },
  
  saveSeasonData() {
    const teamId = this.getCurrentTeamId();
    this.setItem(`seasonData_${teamId}`, JSON.stringify(App.data.seasonData));
  },
  
  saveAll() {
    this.saveSelectedPlayers();
    this.saveStatsData();
    this.savePlayerTimes();
    this.saveSeasonData();
  },
  
  getCurrentPage() {
    return this.getItem("currentPage") || "selection";
  },
  
  setCurrentPage(page) {
    this.setItem("currentPage", page);
  },
  
  // Migration: Alte Keys zu neuen prefixed Keys migrieren
  migrate() {
    // Prüfe ob Migration bereits durchgeführt wurde
    const migrationDone = localStorage.getItem(this.prefix + '_migration_done');
    if (migrationDone === 'true') {
      return; // Migration bereits durchgeführt
    }
    
    console.log('[Storage Migration] Starting migration for s1player_');
    
    // Sammle alle Keys die migriert werden müssen
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Nur Keys ohne Prefix migrieren (nicht s918_, s1player_, s1team_)
      if (key && !key.startsWith('s918_') && !key.startsWith('s1player_') && !key.startsWith('s1team_')) {
        allKeys.push(key);
      }
    }
    
    let migratedCount = 0;
    
    // Migriere alle gefundenen Keys
    allKeys.forEach(oldKey => {
      const oldData = localStorage.getItem(oldKey);
      const newKey = this.prefix + oldKey;
      
      // Nur migrieren wenn alte Daten existieren UND neue nicht existieren
      if (oldData !== null && localStorage.getItem(newKey) === null) {
        localStorage.setItem(newKey, oldData);
        localStorage.removeItem(oldKey);
        migratedCount++;
        console.log(`[Storage Migration] Migrated: ${oldKey} → ${newKey}`);
      }
    });
    
    // Migration als abgeschlossen markieren
    localStorage.setItem(this.prefix + '_migration_done', 'true');
    
    if (migratedCount > 0) {
      console.log(`[Storage Migration] Completed! Migrated ${migratedCount} keys.`);
    } else {
      console.log('[Storage Migration] No keys to migrate.');
    }
  }
};
