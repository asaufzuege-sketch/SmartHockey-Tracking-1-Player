// Team Selection Modul
App.teamSelection = {
  currentTeam: null,
  teams: {},
  
  init() {
    this.loadTeams();
    this.attachEvents();
    this.updateDisplay();
  },
  
  loadTeams() {
    try {
      const savedTeams = localStorage.getItem("teams");
      if (savedTeams) {
        this.teams = JSON.parse(savedTeams);
      } else {
        // Standard Teams erstellen
        this.teams = {
          1: { name: "Neues Team", players: [] },
          2: { name: "Neues Team", players: [] },
          3: { name: "Neues Team", players: [] }
        };
        this.saveTeams();
      }
      
      // Aktuelles Team laden
      this.currentTeam = Number(localStorage.getItem("currentTeam")) || null;
    } catch (e) {
      console.warn("Team load failed:", e);
      this.teams = {
        1: { name: "Neues Team", players: [] },
        2: { name: "Neues Team", players: [] },
        3: { name: "Neues Team", players: [] }
      };
    }
  },
  
  saveTeams() {
    try {
      localStorage.setItem("teams", JSON.stringify(this.teams));
      if (this.currentTeam) {
        localStorage.setItem("currentTeam", String(this.currentTeam));
      }
    } catch (e) {
      console.warn("Team save failed:", e);
    }
  },
  
  updateDisplay() {
    for (let i = 1; i <= 3; i++) {
      const nameEl = document.getElementById(`teamName${i}`);
      const btnEl = document.getElementById(`teamBtn${i}`);
      
      if (nameEl && this.teams[i]) {
        nameEl.textContent = this.teams[i].name;
      }
      
      if (btnEl) {
        btnEl.textContent = `${this.teams[i]?.name || `Team ${i}`} auswählen`;
        
        // Aktuelles Team hervorheben
        if (this.currentTeam === i) {
          btnEl.classList.add("active-team");
        } else {
          btnEl.classList.remove("active-team");
        }
      }
    }
    
    // Current Team Display in anderen Seiten
    this.updateCurrentTeamDisplay();
  },
  
  updateCurrentTeamDisplay() {
    const currentTeamDisplays = [
      document.getElementById("currentTeamDisplay"),
      document.getElementById("statsTeamDisplay")
    ];
    
    currentTeamDisplays.forEach(display => {
      if (display && this.currentTeam && this.teams[this.currentTeam]) {
        display.textContent = this.teams[this.currentTeam].name;
      }
    });
  },
  
  selectTeam(teamNumber) {
    this.currentTeam = teamNumber;
    this.saveTeams();
    this.updateDisplay();
    
    // Zu Spielerauswahl wechseln
    App.showPage("selection");
  },
  
  editTeamName(teamNumber) {
    const modal = document.getElementById("teamEditModal");
    const input = document.getElementById("teamNameInput");
    
    if (modal && input) {
      input.value = this.teams[teamNumber]?.name || "";
      input.dataset.teamNumber = teamNumber;
      modal.style.display = "flex";
      input.focus();
    }
  },
  
  saveTeamName() {
    const input = document.getElementById("teamNameInput");
    const modal = document.getElementById("teamEditModal");
    
    if (input && input.dataset.teamNumber) {
      const teamNumber = Number(input.dataset.teamNumber);
      const newName = input.value.trim() || `Team ${teamNumber}`;
      
      if (!this.teams[teamNumber]) {
        this.teams[teamNumber] = { name: newName, players: [] };
      } else {
        this.teams[teamNumber].name = newName;
      }
      
      this.saveTeams();
      this.updateDisplay();
      
      if (modal) {
        modal.style.display = "none";
      }
    }
  },
  
  cancelEdit() {
    const modal = document.getElementById("teamEditModal");
    if (modal) {
      modal.style.display = "none";
    }
  },
  
  getCurrentTeam() {
    return this.currentTeam;
  },
  
  getCurrentTeamData() {
    return this.currentTeam ? this.teams[this.currentTeam] : null;
  },
  
  attachEvents() {
    // Team Auswahl Buttons
    for (let i = 1; i <= 3; i++) {
      const btn = document.getElementById(`teamBtn${i}`);
      const editBtn = document.getElementById(`editBtn${i}`);
      
      if (btn) {
        btn.addEventListener("click", () => {
          this.selectTeam(i);
        });
      }
      
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.editTeamName(i);
        });
      }
    }
    
    // Modal Events
    const saveBtn = document.getElementById("saveTeamNameBtn");
    const cancelBtn = document.getElementById("cancelTeamEditBtn");
    const modal = document.getElementById("teamEditModal");
    const input = document.getElementById("teamNameInput");
    
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        this.saveTeamName();
      });
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.cancelEdit();
      });
    }
    
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.saveTeamName();
        } else if (e.key === "Escape") {
          this.cancelEdit();
        }
      });
    }
    
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.cancelEdit();
        }
      });
    }
    
    // Zurück zur Teamauswahl Button
    const backToTeamBtn = document.getElementById("backToTeamSelectionBtn");
    if (backToTeamBtn) {
      backToTeamBtn.addEventListener("click", () => {
        App.showPage("teamSelection");
      });
    }
  }
};
