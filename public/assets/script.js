let token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const addPostForm = document.getElementById("add-post-form");
  const logoutLink = document.getElementById("logout-link");

  // Attach logout function
  if (logoutLink) {
    logoutLink.style.display = token ? "inline" : "none";
    logoutLink.addEventListener("click", logout);
  }

  // Register Form Handler
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      register();
    });
  }

  // Login Form Handler
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      login();
    });
  }

  // Add Post Form Handler
  if (addPostForm) {
    if (!token) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    addPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
      createPost();
    });
  }

  // Auto-fetch posts if index.html
  if (document.getElementById("posts")) {
    fetchPosts();
  }
});

// Register
function register() {
  const username = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
      }
    })
    .catch((err) => console.error("Register Error:", err));
}

// Login
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Login failed");
      }
    })
    .catch((err) => console.error("Login Error:", err));
}

// Logout
function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(() => {
    localStorage.removeItem("authToken");
    token = null;
    window.location.href = "login.html";
  });
}

// Fetch Posts
function fetchPosts() {
  fetch("http://localhost:3001/api/posts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      posts.forEach((post) => {
        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <small>By ${post.postedBy} on ${new Date(post.createdOn).toLocaleString()}</small>
        `;
        postsContainer.appendChild(div);
      });
    })
    .catch((err) => console.error("Fetch Posts Error:", err));
}

// Create Post
function createPost() {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!title || !content) {
    alert("Please fill in all fields");
    return;
  }

  fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      window.location.href = "index.html";
    })
    .catch((err) => console.error("Create Post Error:", err));
}
