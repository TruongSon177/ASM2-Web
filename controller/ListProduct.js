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


}