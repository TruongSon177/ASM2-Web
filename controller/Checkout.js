window.Checkout = function ($scope, $http, $location, $timeout) {
    const BASE_URL = "http://localhost:3000";

    $scope.handleRemoveCart = (id) => {
        let userId = localStorage.getItem("id");

        // Fetch the complete user object
        $http.get(`http://localhost:3000/users/${userId}`)
            .then((response) => {
                let user = response.data;
                if (user) {
                    // Find the index of the item in the user's cart array
                    let index = user.cart.findIndex(item => item.id === id);

                    if (index !== -1) {
                        // Remove the item from the user's cart array
                        user.cart.splice(index, 1);

                        // Update the user object in the database
                        $http.put(`http://localhost:3000/users/${userId}`, user)
                            .then((response) => {
                                console.log('Item removed successfully');
                                // Optionally, you can fetch the updated cart after removing the item
                                $scope.fetchUserCart();
                            })
                            .catch((error) => {
                                console.error('Error updating user:', error);
                            });
                    } else {
                        console.log('Item not found in user cart');
                    }
                } else {
                    console.error('User not found');
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };


    $scope.fetchUserCart = function () {
        let userId = localStorage.getItem("id");

        $http.get(`http://localhost:3000/users/${userId}`)
            .then((response) => {
                let user = response.data;
                if (user) {
                    $scope.userCart = user.cart;

                    console.log($scope.userCart);
                    $scope.totalPrice = 0;
                    for (let i = 0; i < $scope.userCart.length; i++) {
                        $scope.totalPrice += $scope.userCart[i].price;
                    }


                    $scope.slCard = $scope.userCart.length;
                    console.log($scope.slCard);
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };
    $scope.fetchUserCart();

    let userId = localStorage.getItem("id");
    $http.get(`http://localhost:3000/users/${userId}`).then((res) => {
        $scope.username = res.data.username
        $scope.phone = res.data.phone
    })

     function validatePhoneNumber(phone) {
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    }
    $scope.handlePayment = () => {
        let userId = localStorage.getItem("id");
        let check = validateFormAdd();
        if(check){
        // Fetch the user's data including the cart from the backend
        $http.get(`http://localhost:3000/users/${userId}`)
            .then((response) => {
                let user = response.data;
                if (user) {
                    // Create an order object
                    let order = {
                        id: user.id,
                        username: user.username,
                        phone: user.phone,
                        address: $scope.address, // Assuming the user has an address property
                        payment: $scope.paymentMethod,
                        "product-card": user.cart 
                    };
                    if(order["product-card"].length === 0){
                        Swal.fire({
                            icon: 'error',
                            title: 'Order Placed!',
                            text: 'No Product',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        return
                    }

                    // Send the order data to the backend to store it
                    $http.post('http://localhost:3000/orders', order)
                        .then((res) => {
                            // Display success notification
                            Swal.fire({
                                icon: 'success',
                                title: 'Order Placed!',
                                text: 'Your order has been placed successfully.',
                                showConfirmButton: false,
                                timer: 2000
                            });
                            

                            // Clear the user's cart
                            user.cart = [];

                            // Update the user object in the database to clear the cart
                            $http.put(`http://localhost:3000/users/${userId}`, user)
                                .then((response) => {
                                    console.log('User cart cleared successfully');

                                })
                                .catch((error) => {
                                    console.error('Error clearing user cart:', error);
                                });
                        })
                        .catch((error) => {
                            // Display error notification
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to place the order. Please try again later.',
                                confirmButtonText: 'OK'
                            });
                            console.error('Error placing order:', error);
                        });
                }
            })
            .catch((error) => {
                // Display error notification
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch user data. Please try again later.',
                    confirmButtonText: 'OK'
                });
                console.error('Error fetching user data:', error);
            });
        }
    };

    const validateFormAdd = () => {
        let check = true;
    
        $scope.errorCheck = {
          errorUser: false,
          errorAddress: false,
          errorPhone: false,
          errorPayment: false,
        };
    
        $scope.errorMsg = {
            errorUser: "",
          errorAddress: "",
          errorPhone: "",
          errorPayment: "",
        };
    
        if (!$scope.username) {
          $scope.errorCheck.errorTen = true;
          check = false;
          $scope.errorMsg.errorUser = "Name is not empty";
        }
        if (!$scope.address || $scope.address.length < 5) {
          $scope.errorCheck.errorAddress = true;
          check = false;
          $scope.errorMsg.errorAddress = "Address is not empty and password length < 5 ";
        }
        if (!$scope.phone || !validatePhoneNumber($scope.phone)) {
            $scope.errorCheck.errorPhone = true;
            $scope.errorMsg.errorPhone = "Phone must be a 10-digit number starting with 0";
            return; 
        }
        
         if(!$scope.paymentMethod){
            $scope.errorCheck.errorPayment = true;
            check = false;
            $scope.errorMsg.errorPayment = "Payment is not empty";
        }
    
       
        return check;
      };

   



}