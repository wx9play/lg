// Envio de solicitações de orçamento pelo EmailJS com intervalo de 12 horas por navegador/dispositivo.
(() => {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const SERVICE_ID = 'service_scgt8bh';
  const TEMPLATE_ID = 'template_i5fjdmr';
  const PUBLIC_KEY = 'p5nZ6K9_yGDTQOVNy';
  const STORAGE_KEY = 'lgtech_orcamento_ultimo_envio';
  const COOLDOWN_MS = 12 * 60 * 60 * 1000;

  const button = document.getElementById('quote-submit');
  const status = document.getElementById('quote-status');
  let countdownTimer = null;
  let sending = false;

  const setButton = (disabled, label) => {
    if (!button) return;
    button.disabled = disabled;
    button.textContent = label;
  };

  const getLastSent = () => {
    try {
      const value = Number(localStorage.getItem(STORAGE_KEY));
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
      console.warn('Não foi possível consultar o armazenamento local:', error);
      return 0;
    }
  };

  const formatRemaining = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const updateCooldown = () => {
    const lastSent = getLastSent();
    if (!lastSent) {
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      setButton(false, 'Enviar solicitação');
      if (status && status.dataset.cooldown === 'true') {
        status.textContent = '';
        delete status.dataset.cooldown;
      }
      return false;
    }

    const remaining = lastSent + COOLDOWN_MS - Date.now();
    if (remaining <= 0) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* armazenamento indisponível */ }
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      setButton(false, 'Enviar solicitação');
      if (status) {
        status.textContent = 'O prazo de espera terminou. Você já pode enviar uma nova solicitação.';
        delete status.dataset.cooldown;
      }
      return false;
    }

    setButton(true, `Aguarde ${formatRemaining(remaining)}`);
    if (status) {
      status.dataset.cooldown = 'true';
      status.textContent = `Você já enviou uma solicitação. Um novo envio estará disponível após 12 horas. Tempo restante: ${formatRemaining(remaining)}.`;
    }
    return true;
  };

  const startCooldownDisplay = () => {
    updateCooldown();
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCooldown, 1000);
  };

  // Restaura o bloqueio mesmo se o usuário atualizar ou reabrir a página.
  startCooldownDisplay();

  if (!window.emailjs) {
    if (status && !getLastSent()) status.textContent = 'Não foi possível carregar o serviço de envio. Atualize a página e tente novamente.';
    return;
  }

  emailjs.init({ publicKey: PUBLIC_KEY });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || updateCooldown()) return;
    if (!form.reportValidity()) return;

    sending = true;
    setButton(true, 'Enviando...');
    if (status) status.textContent = 'Enviando sua solicitação...';

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
      // O período de 12 horas só começa após confirmação de envio pelo EmailJS.
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch (storageError) {
        console.warn('Não foi possível salvar o intervalo de envio neste navegador:', storageError);
      }
      form.reset();
      if (status) status.textContent = 'Solicitação enviada com sucesso! A LG Tech recebeu suas informações.';
      startCooldownDisplay();
    } catch (error) {
      console.error('EmailJS send error:', error);
      if (status) status.textContent = 'Não foi possível enviar agora. Verifique sua conexão e tente novamente. O intervalo de 12 horas não foi iniciado.';
      setButton(false, 'Enviar solicitação');
    } finally {
      sending = false;
      if (getLastSent()) updateCooldown();
    }
  });
})();
