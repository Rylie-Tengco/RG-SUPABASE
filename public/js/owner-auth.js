// Supabase setup
if (typeof supabase === "undefined") {
    console.error("Supabase library is not loaded. Please include it before this script.");
}

const { createClient } = supabase;
const supabaseClient = createClient(
    'https://xiopytnqzutiixdgqxln.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpb3B5dG5xenV0aWl4ZGdxeGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MDU3NjYsImV4cCI6MjA1NjQ4MTc2Nn0.N5IfXuoTGa0cXBk9jviteOBOP6FclEPhwuze3Rj7FKs'
);

// Function to handle owner login
async function handleOwnerLogin(event) {
    event.preventDefault();

    const loginBtn = event.target.querySelector(".login-button");
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing In...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        // Fetch owner credentials from Supabase
        const { data, error } = await supabaseClient
            .from("owners")
            .select("owner_email, owner_password")
            .eq("owner_email", email)
            .single();

        if (error || !data) {
            throw new Error("Invalid email or password");
        }

        // Verify password (assuming plaintext, but should be hashed)
        if (password !== data.owner_password) {
            throw new Error("Invalid email or password");
        }

        // Store session and redirect to owner dashboard
        sessionStorage.setItem("owner_token", "supabase_owner_token");
        localStorage.setItem("owner_token", "supabase_owner_token");
        window.location.href = "owner-dashboard.html";
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
    }
}

// Function to show notifications
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = 'notification ${type}';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ownerLoginForm");
    if (form) {
        form.addEventListener("submit", handleOwnerLogin);
    }
});