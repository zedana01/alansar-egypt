// Al-Ansar Contact Form Master Handler - Cloudflare Pages
(function () {
  function initContactForm() {
    var form = document.querySelector('form.et_pb_contact_form');
    if (!form) return;

    var btn = document.getElementById('alansar_btn_submit') || form.querySelector('.et_pb_contact_submit');
    if (!btn) return;

    // Convert button to type="button" to prevent native form submission / 405 error
    btn.setAttribute('type', 'button');
    btn.id = 'alansar_btn_submit';

    // Prevent any submit on the form
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }, true);

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var msgContainer = document.querySelector('.et-pb-contact-message');
      if (!msgContainer) {
        msgContainer = document.createElement('div');
        msgContainer.className = 'et-pb-contact-message';
        form.parentNode.insertBefore(msgContainer, form);
      }

      var nameInput = form.querySelector('input[data-original_id="name"]') || form.querySelector('input[name*="name"]');
      var emailInput = form.querySelector('input[data-original_id="email"]') || form.querySelector('input[name*="email"]');
      var messageInput = form.querySelector('textarea[data-original_id="message"]') || form.querySelector('textarea[name*="message"]');

      var nameVal = nameInput ? nameInput.value.trim() : '';
      var emailVal = emailInput ? emailInput.value.trim() : '';
      var messageVal = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!nameVal || !emailVal || !messageVal) {
        msgContainer.innerHTML = '<div style="background:#fde8e8; color:#9b1c1c; padding:14px 18px; border-radius:8px; margin-bottom:18px; font-weight:bold; font-size:15px; border:1px solid #f8b4b4; text-align:center;">⚠️ يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).</div>';
        msgContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        msgContainer.innerHTML = '<div style="background:#fde8e8; color:#9b1c1c; padding:14px 18px; border-radius:8px; margin-bottom:18px; font-weight:bold; font-size:15px; border:1px solid #f8b4b4; text-align:center;">⚠️ يرجى إدخال بريد إلكتروني صحيح.</div>';
        msgContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // UI Loading state
      btn.disabled = true;
      var origText = btn.innerText;
      btn.innerText = 'جاري إرسال طلبك...';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';
      msgContainer.innerHTML = '';

      var payload = {
        name: nameVal,
        email: emailVal,
        message: messageVal,
        _subject: 'طلب جديد من موقع الأنصار - ' + nameVal,
        _replyto: emailVal
      };

      // Send to FormSubmit for info@alansaregypt.com AND nsarwebsite1@gmail.com
      var p1 = fetch('https://formsubmit.co/ajax/info@alansaregypt.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {});

      var p2 = fetch('https://formsubmit.co/ajax/nsarwebsite1@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {});

      Promise.all([p1, p2]).finally(function () {
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (messageInput) messageInput.value = '';

        btn.disabled = false;
        btn.innerText = origText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';

        // WhatsApp direct link for quick conversation
        var waMsg = encodeURIComponent('مرحباً مؤسسة الأنصار، تم إرسال رسالة من الموقع:\nالاسم: ' + nameVal + '\nالإيميل: ' + emailVal + '\nالرسالة: ' + messageVal);
        var waUrl = 'https://wa.me/201000097319?text=' + waMsg;

        msgContainer.innerHTML = [
          '<div style="background:#def7ec; color:#03543f; padding:22px 24px; border-radius:10px; margin-bottom:24px; font-weight:bold; font-size:17px; line-height:1.7; border:2px solid #31c48d; text-align:center; box-shadow:0 6px 16px rgba(0,0,0,0.08);">',
          '  <div style="font-size:36px; color:#0e9f6e; margin-bottom:8px;">✓</div>',
          '  <div style="font-size:18px; color:#03543f; margin-bottom:12px;">تم استلام طلبك بنجاح، وسيتم الرد عليك في أقرب وقت.</div>',
          '  <a href="' + waUrl + '" target="_blank" style="display:inline-block; background:#25D366; color:#fff; text-decoration:none; padding:10px 20px; border-radius:6px; font-size:15px; font-weight:600; margin-top:6px; box-shadow:0 2px 6px rgba(37,211,102,0.4);">',
          '    <span>📱 أو تواصل معنا فوراً عبر واتساب</span>',
          '  </a>',
          '</div>'
        ].join('');

        msgContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
