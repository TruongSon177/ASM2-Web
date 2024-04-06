window.Login = function($scope , $http, $location , $timeout){
    const BASE_URL = "http://localhost:3000";
    
     $scope.handleLogin = function() {
        let user1 = $scope.user;
        let password = $scope.password;

        $http.get(`${BASE_URL}/users`)
            .then((res) => {
                let listUser = res.data;
                let matchedUser = listUser.find(user => user.username === user1 && user.password === password);
               
                if (matchedUser) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful!',
                        text: 'Welcome ' + matchedUser.username + '!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    if(user1 !== undefined && matchedUser.id !== undefined) { 
                        localStorage.setItem("id", matchedUser.id); 
                        localStorage.setItem('username', user1); 
                        localStorage.setItem("role" , matchedUser.role)
                    }
                    
                    $timeout(function() {
                        if (matchedUser.role === 'admin') {
                            $location.path('/admin');
                        } else if (matchedUser.role === 'user') {
                            $location.path('/');
                        } else {
                            // Handle other roles or unexpected cases
                            console.error('Invalid user role:', matchedUser.role);
                        }
                    }, 2000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Invalid username or password',
                        confirmButtonText: 'Retry'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch user data. Please try again later.',
                    confirmButtonText: 'Retry'
                });
            });
    };
}
