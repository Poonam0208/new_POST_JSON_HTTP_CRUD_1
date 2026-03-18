let cl = console.log;


const PostContainer = document.getElementById('PostContainer');
const spinner = document.getElementById('spinner')
const PostForm = document.getElementById('PostForm');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');

const BASE_URL = `https://postcard-6a86d-default-rtdb.firebaseio.com`;
const POST_URL = `${BASE_URL}/posts.json`;



function SnackBar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

let postArr;


function CreatePostCard(arr) {
    let result = ``;

    for (let i = arr.length - 1; i >= 0; i--) {
        result += `
         <div class="col-md-4 mb-4" id="${arr[i].id}">
            <div class="card h-100">
                <div class="card-header">
                    <h5>${arr[i].title}</h5>
                </div>
                <div class="card-body">
                    <p>${arr[i].body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                      <button onclick ="onEdit(this)" class="btn btn-outline-primary">Edit</button>
                      <button onclick ="onRemove(this)"  class="btn btn-outline-danger">Delete</button>
                </div>
            </div>
        </div>
        
        `
    }
    PostContainer.innerHTML = result;

}

function fetchBlog() {
    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest();

    xhr.open('GET', POST_URL, true);

    xhr.send();

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 299) {
            let postArr = JSON.parse(xhr.response)
            CreatePostCard(postArr)
            spinner.classList.add('d-none')

        } else {
            SnackBar(`Somthing went wrong !!!`, `error`)
            spinner.classList.add('d-none')
        }
    }
}

fetchBlog()

function onSubmitPost(eve) {
    eve.preventDefault();

    let POST_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    cl(POST_OBJ)


    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    xhr.open("POST", POST_URL, true)
    xhr.send(JSON.stringify(POST_OBJ));

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 299) {
            // cl(xhr.response)

            PostForm.reset();
            let res = JSON.parse(xhr.response)

            let col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.id = res.id;

            col.innerHTML = `
            <div class="card h-100">
                <div class="card-header">
                    <h5>${POST_OBJ.title}</h5>
                </div>
                <div class="card-body">
                    <p>${POST_OBJ.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                      <button onclick ="onEdit(this)" class="btn btn-outline-primary">Edit</button>
                      <button onclick ="onRemove(this)"  class="btn btn-outline-danger">Delete</button>
                </div>
            </div>
            `

            PostContainer.prepend(col)
            spinner.classList.add('d-none')
        } else {
            SnackBar(`Somthing went wrong !!!`, `error`)
            spinner.classList.add('d-none')
        }
    }
}


function onEdit(ele) {
    let EDIT_ID = ele.closest('.col-md-4').id
    localStorage.setItem('EDIT_ID', EDIT_ID)
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest();

    xhr.open('GET', EDIT_URL, true)

    xhr.send(null)

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let postObj = JSON.parse(xhr.response)
            titleControl.value = postObj.title;
            bodyControl.value = postObj.body;
            userIdControl.value = postObj.userId;
            updatePostBtn.classList.remove('d-none')
            addPostBtn.classList.add('d-none')
            spinner.classList.add('d-none')
            snackbar(`The post with id ${EDIT_ID} is patched successfully !!!`, 'success')

        } else {
            spinner.classList.add('d-none')
        }
    }

}




PostForm.addEventListener("submit", onSubmitPost)
