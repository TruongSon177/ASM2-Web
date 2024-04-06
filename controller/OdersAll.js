window.OdersAll = function($scope, $http, $location, $timeout , $routeParams) {
    let role = localStorage.getItem("role");
    console.log(role);
    if(role === null){
        $location.path("/401");
    }
    if (role === "user") {
        $location.path("/401");
    }

 

  

    let id = $routeParams.id;
    if(id){
        $http.get(`http://localhost:3000/products/${id}`).then((res) => {
            $scope.name = res.data.name;
            $scope.price = res.data.price;
            $scope.link = res.data.image;
        })
    }

    $http.get("http://localhost:3000/orders").then((res) => {
        $scope.orders = res.data;
        console.log($scope.orders);
    })
    

 
    $scope.handleXacNhan = (id) => {
        // Fetch the order by ID
        $http.get("http://localhost:3000/orders/" + id).then((res) => {
            let order = res.data; // Retrieved order
            // Update the status of the order
            order.status = "Đã Xác Nhận";
    
            // Send PUT request to update the order
            $http.put("http://localhost:3000/orders/" + id, order).then((res) => {
                if (res.status == 200) {
                    alert("Xác nhận đơn hàng thành công");
                }
            }).catch((error) => {
                console.error("Error updating order:", error);
                alert("Failed to update order. Please try again.");
            });
        }).catch((error) => {
            console.error("Error fetching order:", error);
            alert("Failed to fetch order. Please try again.");
        });
        
    }
    
    
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


    



};
