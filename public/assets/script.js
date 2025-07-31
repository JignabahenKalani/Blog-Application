
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const addPostForm = document.getElementById("add-post-form");
  const logoutLink = document.getElementById("logout-link");

  // Show or hide logout link
  if (logoutLink) {
    const token = localStorage.getItem("authToken");
    logoutLink.style.display = token ? "inline" : "none";
    logoutLink.addEventListener("click", logout);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      register();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      login();
    });
  }

  if (addPostForm) {
    const token = localStorage.getItem("authToken");
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

  // Fetch and display posts if on homepage
  if (document.getElementById("posts")) {
    fetchPosts();

    document.getElementById("posts").addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const postId = e.target.getAttribute("data-id");
        const postDiv = e.target.closest(".post");

        const currentTitle = postDiv.querySelector("h3").innerText;
        const currentContent = postDiv.querySelector("p").innerText;

        postDiv.innerHTML = `
          <input type="text" id="edit-title-${postId}" value="${escapeHtml(currentTitle)}" />
          <textarea id="edit-content-${postId}" rows="4">${escapeHtml(currentContent)}</textarea>
          <br/>
          <button id="save-${postId}">Save</button>
          <button id="cancel-${postId}">Cancel</button>
        `;

        // Save button
        document.getElementById(`save-${postId}`).addEventListener("click", () => {
          const updatedTitle = document.getElementById(`edit-title-${postId}`).value.trim();
          const updatedContent = document.getElementById(`edit-content-${postId}`).value.trim();

          if (!updatedTitle || !updatedContent) {
            alert("Please fill in all fields");
            return;
          }

          fetch(`http://localhost:3001/api/posts/${postId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to update post");
              return res.json();
            })
            .then(() => {
              alert("Post updated successfully.");
              fetchPosts();
            })
            .catch((err) => alert(err.message));
        });

        // Cancel button
        document.getElementById(`cancel-${postId}`).addEventListener("click", fetchPosts);
      }

      if (e.target.classList.contains("delete-btn")) {
        const postId = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this post?")) {
          fetch(`http://localhost:3001/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to delete post");
              alert("Post deleted successfully.");
              fetchPosts();
            })
            .catch((err) => alert(err.message));
        }
      }
    });
  }
});

// Escape HTML (prevent XSS)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

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
    body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        alert("Registration successful.");
        localStorage.setItem("authToken", data.token);
        window.location.href = "index.html";
      } else {
        alert(data.message || "Registration failed.");
      }
    })
    .catch((err) => {
      console.error("Register Error:", err);
      alert("Something went wrong during registration.");
    });
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
        alert("Login successful.");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Login failed.");
      }
    })
    .catch((err) => {
      console.error("Login Error:", err);
      alert("Login failed due to an error.");
    });
}

// Logout
function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).finally(() => {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
  });
}

// Fetch all posts
function fetchPosts() {
  fetch("http://localhost:3001/api/posts")
    .then((res) => res.json())
    .then((posts) => {
      const container = document.getElementById("posts");
      container.innerHTML = "";

      if (!posts.length) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
      }

      posts.forEach((post) => {
        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.content)}</p>
          <small>By ${escapeHtml(post.postedBy)} on ${new Date(post.createdOn).toLocaleString()}</small>
          <br/>
          <button class="edit-btn" data-id="${post.id}">Edit</button>
          <button class="delete-btn" data-id="${post.id}">Delete</button>
        `;
        container.appendChild(div);
      });
    })
    .catch((err) => {
      console.error("Failed to fetch posts:", err);
      document.getElementById("posts").innerHTML = "<p>Error loading posts.</p>";
    });
}

// Create new post
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
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({ title, content }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      alert("Post created successfully.");
      window.location.href = "index.html";
    })
    .catch((err) => {
      console.error("Create Post Error:", err);
      alert("Failed to create post.");
    });
}
