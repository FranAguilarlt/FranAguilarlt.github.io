(function() {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    .switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

    </style>

<div style="display: flex; align-items: center;">
  <label class="switch">
    <input type="checkbox" id="debugToggle">
    <span class="slider round"></span>
  </label>
  <p id="debugStatus" style="margin-left: 10px;">Debugging Mode Inactive</p>
</div>

<div id="debugging-area" style="display: none;">
  <h2>Debugging Mode</h2>
  <button id="getAccessToken">Get Access Token</button>
  <button id="getCsrfToken">Get CSRF Token</button>
  <button id="createJob">Create Job</button>
  <button id="uploadData">Upload Data</button>
  <button id="validateJob">Validate Job</button>
  <button id="runJob">Run Job</button>
  <h3>Messages</h3>
  <div id="messages"></div>
</div>

    `;

})();