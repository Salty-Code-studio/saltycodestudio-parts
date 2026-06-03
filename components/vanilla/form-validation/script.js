/*
 * Accessible form validation — no library.
 *
 * Behaviour
 *   - Validates on blur (after first interaction) and on submit.
 *   - Re-validates on input only once a field is already showing an error,
 *     so the message clears the moment the user fixes it.
 *   - Sets aria-invalid="true|false" on each control.
 *   - Renders the first failing message into the field's
 *     [aria-describedby] error region (an element with class "field__error").
 *   - On submit: if invalid, focuses the first bad field and announces a
 *     form-level status; if valid, announces success and prevents default.
 *
 * Constraints come from native attributes (required, type, minlength,
 * pattern, max, min, maxlength) plus optional data-* rules:
 *   data-match="<id>"   — value must equal another field's value.
 * Custom messages via data-error-<rule>, e.g. data-error-required.
 */
(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Find the error-message element for a control via aria-describedby. */
  function errorRegionFor(control) {
    var ids = (control.getAttribute("aria-describedby") || "").split(/\s+/);
    for (var i = 0; i < ids.length; i++) {
      if (!ids[i]) continue;
      var el = document.getElementById(ids[i]);
      if (el && el.classList.contains("field__error")) return el;
    }
    return null;
  }

  function msg(control, rule, fallback) {
    return control.getAttribute("data-error-" + rule) || fallback;
  }

  /*
   * Validate one control. Returns "" when valid, otherwise the message.
   * Order matters: required -> type -> match -> minlength -> maxlength -> pattern.
   */
  function validate(control) {
    var value = control.value.trim();
    var type = (control.getAttribute("type") || "text").toLowerCase();

    if (control.hasAttribute("required") && value === "") {
      return msg(control, "required", "This field is required.");
    }

    // Nothing more to check on an empty optional field.
    if (value === "") return "";

    if (type === "email" && !EMAIL_RE.test(value)) {
      return msg(control, "type", "Please enter a valid email address.");
    }

    if (type === "url") {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      } catch (e) {
        return msg(control, "type", "Please enter a valid URL.");
      }
    }

    var matchId = control.getAttribute("data-match");
    if (matchId) {
      var other = document.getElementById(matchId);
      if (other && value !== other.value.trim()) {
        return msg(control, "match", "Values do not match.");
      }
    }

    var minlength = parseInt(control.getAttribute("minlength"), 10);
    if (!isNaN(minlength) && value.length < minlength) {
      return msg(control, "minlength", "Use at least " + minlength + " characters.");
    }

    var maxlength = parseInt(control.getAttribute("maxlength"), 10);
    if (!isNaN(maxlength) && value.length > maxlength) {
      return msg(control, "maxlength", "Use at most " + maxlength + " characters.");
    }

    var pattern = control.getAttribute("pattern");
    if (pattern) {
      var re = new RegExp("^(?:" + pattern + ")$");
      if (!re.test(value)) {
        return msg(control, "pattern", "Please match the requested format.");
      }
    }

    if (type === "number") {
      var num = parseFloat(value);
      var min = parseFloat(control.getAttribute("min"));
      var max = parseFloat(control.getAttribute("max"));
      if (!isNaN(min) && num < min) return msg(control, "min", "Must be at least " + min + ".");
      if (!isNaN(max) && num > max) return msg(control, "max", "Must be at most " + max + ".");
    }

    return "";
  }

  /* Apply a validation result to the DOM (aria + message + valid flag). */
  function apply(control, message) {
    var region = errorRegionFor(control);
    if (message) {
      control.setAttribute("aria-invalid", "true");
      control.removeAttribute("data-valid");
      if (region) region.textContent = message;
    } else {
      control.setAttribute("aria-invalid", "false");
      control.setAttribute("data-valid", "true");
      if (region) region.textContent = "";
    }
    return !message;
  }

  function controlsOf(form) {
    return Array.prototype.slice.call(
      form.querySelectorAll("input.field__control, select.field__control, textarea.field__control")
    );
  }

  function wire(form) {
    var controls = controlsOf(form);
    var status = form.querySelector(".form__status");

    controls.forEach(function (control) {
      // Validate when the user leaves the field (after first interaction).
      control.addEventListener("blur", function () {
        apply(control, validate(control));
      });

      // Once a field is in error, re-check live so the message clears on fix.
      control.addEventListener("input", function () {
        if (control.getAttribute("aria-invalid") === "true") {
          apply(control, validate(control));
        }
        // If this field is the target of a data-match, re-check its partner.
        var dependents = form.querySelectorAll('[data-match="' + control.id + '"]');
        Array.prototype.forEach.call(dependents, function (dep) {
          if (dep.getAttribute("aria-invalid") === "true") {
            apply(dep, validate(dep));
          }
        });
      });
    });

    form.addEventListener("submit", function (event) {
      var firstInvalid = null;
      var invalidCount = 0;

      controls.forEach(function (control) {
        var ok = apply(control, validate(control));
        if (!ok) {
          invalidCount++;
          if (!firstInvalid) firstInvalid = control;
        }
      });

      if (firstInvalid) {
        event.preventDefault();
        firstInvalid.focus();
        if (status) {
          status.setAttribute("data-state", "error");
          status.textContent =
            invalidCount === 1
              ? "Please fix the highlighted field."
              : "Please fix the " + invalidCount + " highlighted fields.";
        }
        return;
      }

      if (status) {
        status.setAttribute("data-state", "success");
        status.textContent = "Looks good — submitting…";
      }

      // Demo: prevent a real navigation. Remove this in production so the
      // form posts normally (or call your own fetch/submit here).
      if (form.hasAttribute("data-demo")) {
        event.preventDefault();
        if (status) status.textContent = "Looks good — form is valid.";
      }
    });
  }

  function init(root) {
    var scope = root || document;
    var forms = scope.querySelectorAll("form[data-validate]");
    Array.prototype.forEach.call(forms, wire);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    });
  } else {
    init();
  }

  // Expose for manual init of dynamically inserted forms.
  window.FormValidation = { init: init, validate: validate };
})();
