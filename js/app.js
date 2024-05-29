document.addEventListener("DOMContentLoaded", function () {
  // Function to display loading message
  function showLoadingMessage() {
    document.getElementById("postsList").innerHTML = "<li>Loading posts...</li>";
  }

  // Function to display success message
  function showSuccessMessage(message) {
    document.getElementById("postsList").innerHTML = `<li>${message}</li>`;
  }

  // Function to display error message
  function showErrorMessage(message) {
    document.getElementById("postsList").innerHTML = `<li>${message}</li>`;
  }

  // Function to fetch all posts and display them
  function fetchPosts() {
    showLoadingMessage();
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(posts => {
        // Clear previous posts
        document.getElementById("postsList").innerHTML = "";
        // Display each post
        posts.forEach(post => {
          fetchComments(post.id);
          document.getElementById("postsList").innerHTML += `
                      <li>
                          <h3>${post.title}</h3>
                          <p>${post.body}</p>
                          <ul id="comments-${post.id}">
                              <!-- Comments will be dynamically added here -->
                          </ul>
                      </li>
                  `;
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        showErrorMessage("Failed to fetch posts.");
      });
  }

  // Function to fetch comments for a specific post
  function fetchComments(postId) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(comments => {
        const commentsList = document.getElementById(`comments-${postId}`);
        if (!commentsList) {
          console.error(`Comments list for post ${postId} not found.`);
          return;
        }
        comments.forEach(comment => {
          commentsList.innerHTML += `
                      <li>
                          <strong>${comment.name}</strong>: ${comment.body}
                      </li>
                  `;
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        const commentsList = document.getElementById(`comments-${postId}`);
        if (commentsList) {
          commentsList.innerHTML = "<li>Failed to fetch comments.</li>";
        }
      });
  }

  // Function to create a new post
  document.getElementById("postForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        showSuccessMessage("Post created successfully!");
        // Refresh posts after creating a new one
        fetchPosts();
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        showErrorMessage("Failed to create post.");
      });
  });

  // Function to update a post (PATCH request)
  function updatePost() {
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "PATCH",
      body: JSON.stringify({
        title: "Updated Title",
        body: "Updated Body",
        userId: 1 // This value can be any valid user ID
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        showSuccessMessage("Post updated successfully!");
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        showErrorMessage("Failed to update post.");
      });
  }

  // Function to delete a post
  function deletePost() {
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        showSuccessMessage("Post deleted successfully!");
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        showErrorMessage("Failed to delete post.");
      });
  }

  // Fetch all posts on page load
  fetchPosts();

  // Call updatePost and deletePost functions for demonstration
  updatePost();
  deletePost();
});
