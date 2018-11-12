
function login(userName, password) {
    // TODO: IMPLEMENT USER AUTHENTICATION
    return true;
}

const loginHandler = (request) => {
    const userName = encodeURIComponent(request.payload.user);
    const password = encodeURIComponent(request.payload.password);
    console.log(`Login with ${userName}`);
    return login(userName, password);
};

module.exports = loginHandler;
