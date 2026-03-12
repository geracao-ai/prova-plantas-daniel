const alunoProgresso = {
  STORAGE_KEY: 'prova_daniel_progresso',
  ALUNO_KEY: 'prova_daniel_aluno',
  
  iniciar() {
    let nomeAluno = localStorage.getItem(this.ALUNO_KEY);
    
    if (!nomeAluno) {
      nomeAluno = prompt('Qual é o seu nome?');
      if (nomeAluno && nomeAluno.trim()) {
        localStorage.setItem(this.ALUNO_KEY, nomeAluno.trim());
        this.inicializarProgresso();
      }
    }
    
    this.atualizarDisplay();
    return nomeAluno;
  },
  
  getNomeAluno() {
    return localStorage.getItem(this.ALUNO_KEY);
  },
  
  inicializarProgresso() {
    const provas = ['plantas', 'cantigas_parlendas', 'cantigas_alfabeto', 'sons_nasais', 'paisagem_sonora'];
    let progresso = this.getProgresso();
    
    provas.forEach(prova => {
      if (!progresso[prova]) {
        progresso[prova] = {
          nota: null,
          data: null,
          tentativas: 0,
          completo: false
        };
      }
    });
    
    this.salvarProgresso(progresso);
  },
  
  getProgresso() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },
  
  salvarProgresso(progresso) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progresso));
  },
  
  salvarNota(prova, nota) {
    const progresso = this.getProgresso();
    
    if (!progresso[prova]) {
      progresso[prova] = { nota: null, data: null, tentativas: 0, completo: false };
    }
    
    progresso[prova].nota = nota;
    progresso[prova].data = new Date().toLocaleDateString('pt-BR');
    progresso[prova].tentativas += 1;
    progresso[prova].completo = true;
    
    this.salvarProgresso(progresso);
    this.mostrarMensagemNota(prova, nota);
  },
  
  getNota(prova) {
    const progresso = this.getProgresso();
    return progresso[prova] ? progresso[prova].nota : null;
  },
  
  getStatusProva(prova) {
    const progresso = this.getProgresso();
    return progresso[prova] || { nota: null, data: null, tentativas: 0, completo: false };
  },
  
  mostrarMensagemNota(prova, nota) {
    const mensagens = [
      'Parabéns! Nota máxima! 🌟',
      'Muito bem! Continue assim! 💪',
      'Bom trabalho! Você está melhorando! 📚',
      'Continue estudando! Você consegue! 🎯'
    ];
    
    let mensagem = '';
    if (nota === 10) {
      mensagem = '⭐🌟 PARABÉNS! NOTA MÁXIMA! 🌟⭐';
    } else if (nota >= 8) {
      mensagem = 'Muito bem! Continue assim! 🌟';
    } else if (nota >= 5) {
      mensagem = 'Bom trabalho! Continue estudando! 📚';
    } else {
      mensagem = 'Você consegue! Continue tentando! 💪';
    }
    
    alert(`Você tirou nota ${nota}!\n\n${mensagem}`);
  },
  
  resetar() {
    if (confirm('Tem certeza que quer apagar todo o seu progresso?')) {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.ALUNO_KEY);
      location.reload();
    }
  },
  
  atualizarDisplay() {
    const nomeSpan = document.getElementById('nome-aluno');
    if (nomeSpan) {
      nomeSpan.textContent = this.getNomeAluno();
    }
  }
};

function getNotaDisplay(prova) {
  const status = alunoProgresso.getStatusProva(prova);
  if (status.nota !== null) {
    return `<span class="nota-badge nota-${status.nota >= 7 ? 'alta' : 'baixa'}">${status.nota}/10</span>`;
  }
  return '<span class="nota-badge nota-pendente">Pendente</span>';
}

function getTentativasDisplay(prova) {
  const status = alunoProgresso.getStatusProva(prova);
  if (status.tentativas > 0) {
    return `<small class="tentativas">${status.tentativas}x tentativas</small>`;
  }
  return '';
}
