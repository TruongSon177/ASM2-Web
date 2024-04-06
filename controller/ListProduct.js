window.ListProduct = function ($scope, $http, $location) {
    const BASE_URL = "http://localhost:3000";
    $scope.search = ""
    $scope.listProduct = [];
    $http.get(`${BASE_URL}/products`)
        .then((res) => {
            $scope.listProduct = res.data
        })
        .catch((err) => {
            console.log(err);
        });

    $scope.isLoggedIn = function () {
        return localStorage.getItem('username') !== null;
    };

    let dataLocal = localStorage.getItem('username')
    $scope.getUsername = dataLocal

    $scope.handleLogout = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('id')
        localStorage.removeItem("role")
        window.location.reload();
    }
    $scope.userData = []
    let idNguoiDung = localStorage.getItem("id");
    $http.get(`http://localhost:3000/users/${idNguoiDung}`)
    .then((res) => {
        $scope.username = res.data.username;
        $scope.pass = res.data.password;
        $scope.phone = res.data.phone
        $scope.userData = res.data;
    })

    $scope.handleSaveChange = function() {
        let idNguoiDung = localStorage.getItem("id");
        
        var updatedData = {
            id: idNguoiDung,
            username: $scope.userData.username, 
            password: $scope.pass, 
            phone: $scope.phone, 
            role: $scope.userData.role,
            cart: $scope.userData.cart
        };
    
     
        $http.put('http://localhost:3000/users/' + idNguoiDung, updatedData)
            .then(function(response) {
                alert("Cap nhap thanh cong")
                console.log('Thông tin người dùng đã được cập nhật:', response.data);
           
            })
            .catch(function(error) {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            });
    }
    



  

    $scope.handleBuyCart = (productId) => {
        let userId = localStorage.getItem("id");

        // Fetch the product data
        $http.get('http://localhost:3000/products/' + productId)
            .then((productResponse) => {
                let productData = productResponse.data;

                // Fetch the user data
                $http.get(`http://localhost:3000/users/${userId}`)
                    .then((userResponse) => {
                        let user = userResponse.data;

                        if (user) {
                            user.cart.push(productData);
                            $http.put(`http://localhost:3000/users/${userId}`, user)
                                .then((res) => {
                                    console.log("Product added to the cart successfully.");
                                })
                                .catch((error) => {
                                    console.error('Error updating user cart:', error);
                                });
                        } else {
                            console.error('User not found.');
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching user data:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching product information:', error);
            });
    };


    $scope.userCart = [];


    $scope.fetchUserCart = function () {
        let userId = localStorage.getItem("id");

        $http.get(`http://localhost:3000/users/${userId}`)
            .then((response) => {
                let user = response.data;
                if (user) {
                    $scope.userCart = user.cart;
                    $scope.slCard = $scope.userCart.length;
                    console.log($scope.slCard);
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };
    $scope.fetchUserCart();





    let idUserHist = localStorage.getItem("id");
let apiUrl = "http://localhost:3000/orders";

$http.get(apiUrl)
    .then((response) => {
        let orders = response.data;
        let products = [];

        orders.forEach(order => {
            if (order.id === idUserHist) {
                products.push(...order["product-card"]);
            }
        });

        if (products.length > 0) {
            $scope.products = products;
        } else {
            console.log("Không tìm thấy sản phẩm trong đơn hàng");
        }
    })
    .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
    });



    $scope.formData = {};

    $scope.submitForm = function() {
        sendEmail($scope.formData.name, $scope.formData.email, $scope.formData.message);
        $scope.formData = {}; 
    };

    function sendEmail(name, email, message) {
        Email.send({
            SecureToken: "plsvbzaariwcyyet",
            To: "nguyensonabc5@gmail.com",
            From: email,
            Subject: "New message from " + name,
            Body: "Name: " + name + "<br>Email: " + email + "<br>Message: " + message
        }).then(
            function(response) {
                alert("Message sent successfully!");
            },
            function(error) {
                alert("Error occurred while sending message.");
                console.error(error);
            }
        );
    }


}