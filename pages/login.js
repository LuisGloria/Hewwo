document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok && data.token) {
    // Store JWT locally
    localStorage.setItem("jwt", data.token);
    window.location.href = `http://localhost:8080/dashboard/index.html?token=${data.token}`;
  } else {
    document.getElementById("message").textContent = "Invalid credentials";
  }
});
