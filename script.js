const API_URL = 'http://localhost:3000/blogs';
let editMode = false;
let editId = null;

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const blogs = await response.json();
        const list = document.getElementById('blogsList');
        list.innerHTML = blogs.map(blog => {
            const title = encodeURIComponent(blog.title);
            const body = encodeURIComponent(blog.body);
            const author = encodeURIComponent(blog.author);

            return `
                <div class="blog-post">
                    <h3>${blog.title}</h3>
                    <p>${blog.body}</p>
                    <div class="meta">By: ${blog.author}</div>
                    <div style="margin-top: 10px;">
                        <button onclick="prepareEdit('${blog._id}', '${title}', '${body}', '${author}')" style="background: #ffc107; color: black;">Edit</button>
                        <button onclick="deletePost('${blog._id}')" style="background: #dc3545; color: white;">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error("Error fetching blogs:", err);
    }
}

async function savePost() {
    const title = document.getElementById('title').value.trim();
    const body = document.getElementById('body').value.trim();
    const author = document.getElementById('author').value.trim();

    if (!title || !body) {
        alert('Title and Body are required');
        return;
    }

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `${API_URL}/${editId}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, author: author || "Anonymous" })
        });

        if (response.ok) {
            resetForm();
            fetchPosts();
        }
    } catch (err) {
        console.error("Error saving post:", err);
    }
}

async function deletePost(id) {
    if (confirm('Are you sure?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchPosts();
    }
}

function prepareEdit(id, title, body, author) {
    document.getElementById('title').value = decodeURIComponent(title);
    document.getElementById('body').value = decodeURIComponent(body);
    document.getElementById('author').value = decodeURIComponent(author);
    editMode = true;
    editId = id;
    document.getElementById('submitBtn').innerText = "Update Post";
}

function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
    document.getElementById('author').value = '';
    editMode = false;
    editId = null;
    document.getElementById('submitBtn').innerText = "Publish Post";
}

fetchPosts();