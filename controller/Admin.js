window.Admin = function($scope, $http, $location, $timeout , $routeParams) {
    let role = localStorage.getItem("role");
    console.log(role);
    if(role === null){
        $location.path("/401");
    }
    if (role === "user") {
        $location.path("/401");
    }

    $scope.handleRemove = (id) => {
     $http.delete(`http://localhost:3000/products/${id}`).then((res) => {
        if(res.status == 200){
            alert("Delete product success");
            $http.get("http://localhost:3000/products").then((res) => {
                $scope.products = res.data;
            })
        }
     
     })}

    

    $http.get("http://localhost:3000/products").then((res) => {
        $scope.products = res.data;
    })

    $scope.handleAdd = () =>{
        console.log("click");
        let check = validateFormAdd();
        if(check){
            const data = {
                id: Math.floor(Math.random() * 1000),
                name: $scope.name,
                price: $scope.price,
                image: $scope.link
            }
            $http.post("http://localhost:3000/products" , data).then((res) => {
                if(res.status == 201){
                    alert("Add product success");
                }
            })
        }
    
    }

    let id = $routeParams.id;
    if(id){
        $http.get(`http://localhost:3000/products/${id}`).then((res) => {
            $scope.name = res.data.name;
            $scope.price = res.data.price;
            $scope.link = res.data.image;
        })
    }
//    $http.get(`http://localhost:3000/products/${$routeParams.id}`).then((res) => {
//         $scope.name = res.data.name;
//         $scope.price = res.data.price;
//         $scope.link = res.data.image;
//     })

    

    $scope.handleUpdate= () => {

      let id = $routeParams.id;
        console.log(id);
       let check = validateFormAdd();
       if(check){
        const data = {
            id: id,
            name: $scope.name,
            price: $scope.price,
            image: $scope.link
        }
        $http.put(`http://localhost:3000/products/${id}`, data).then((res) => {
            if(res.status == 200){
                alert("Update product success");
                $location.path("/admin");
            }
        })
       }

   


    }

    const validateFormAdd = () => {
        let check = true;
    
        $scope.errorCheck = {
            errorName: false,
            errorLink: false,
            errorPrice: false, 
        };
    
        $scope.errorMsg = {
            errorName: "",
            errorLink: "",
            errorPrice: "",
        };
    
        if (!$scope.name) { 
            $scope.errorCheck.errorName = true;
            check = false;
            $scope.errorMsg.errorName = "Name cannot be empty"; 
        }
        if (!$scope.price || isNaN($scope.price)) {
            $scope.errorCheck.errorPrice = true;
            check = false;
            $scope.errorMsg.errorPrice = "Price must be a number and cannot be empty";
        }
        if (!$scope.link) { 
            $scope.errorCheck.errorLink = true;
            check = false;
            $scope.errorMsg.errorLink= "Image link cannot be empty"; 
        }
    
        return check;
    };

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
                    // Assuming you want to update the status in the UI,
                    // you can update the corresponding order object in the orders array.
                    // Alternatively, you can reload the orders from the server.
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
