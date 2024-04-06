window.Signup = function($scope, $http, $location , $timeout) {
    const BASE_URL = "http://localhost:3000";
     
    $scope.register = function() {
        let check = validateFormAdd()
        if(check){
        let dataRegister = {
            id: (Math.floor(Math.random() * 9999) + 1) + "" ,
            username: $scope.username,
            password: $scope.pass,
            phone: $scope.phone,
            role: "user",
            cart: [],
            orders: []
        }

    
            $http.post(`${BASE_URL}/users`, dataRegister)
            .then((res) => {
               if(res.status == 201)
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'You have successfully registered.',
                    showConfirmButton: false,
                    timer: 2000
                });
              
                $location.path('/login');
                

            })
            .catch((err) => {
                console.error(err);
                // Handle error here if registration fails
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'Failed to register. Please try again later.',
                    confirmButtonText: 'Retry'
                });
            });

        }

       
    };
   
    function validatePhoneNumber(phone) {
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    }

    const validateFormAdd = () => {
        let check = true;
    
        $scope.errorCheck = {
          errorUser: false,
          errorPass: false,
          errorPhone: false,
          errorCofirm: false,
        };
    
        $scope.errorMsg = {
            errorUser: "",
            errorPass: "",
            errorPhone: "",
            errorCofirm: "",
        };
    
        if (!$scope.username) {
          $scope.errorCheck.errorTen = true;
          check = false;
          $scope.errorMsg.errorUser = "Name is not empty";
        }
        if (!$scope.pass || $scope.pass.length < 5) {
          $scope.errorCheck.errorPass = true;
          check = false;
          $scope.errorMsg.errorPass = "Password is not empty and password length < 5 ";
        }
        if (!$scope.phone || !validatePhoneNumber($scope.phone)) {
            $scope.errorCheck.errorPhone = true;
            $scope.errorMsg.errorPhone = "Phone must be a 10-digit number starting with 0";
            return; 
        }
         if (!$scope.repeat) {
          $scope.errorCheck.errorCofirm = true;
          check = false;
          $scope.errorMsg.errorCofirm = "Comfirm password is not empty";
        }else if($scope.pass !== $scope.repeat){
            $scope.errorCheck.errorCofirm = true;
            check = false;
            $scope.errorMsg.errorCofirm = "Comfirm in correct";
        }
    
       
        return check;
      };
    
}
