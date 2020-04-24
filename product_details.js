Vue.component('product-details', {
    props: {
        products: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="row">
            <div class="col-lg-6">
                <h3 class="font-weight-bold mb-3">Product Details :</h3>
                <table class="table table-striped table-bordered">
                    <thead class="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Name Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="!products.length"><td colspan="5" class="text-center">No Records</td></tr>
                        <tr v-for="product in products" :key="products.id">
                            <td>{{ product.id }}</td>
                            <td>
                                <input v-model="product.name" v-if="product.isEdit" class="form-control"
                                    @keyup.enter="product.isEdit = false; updateProduct(product.id, product)">
                                <label v-else @click="product.isEdit = true;">{{ product.name }}</label>
                            </td>

                            <td>
                                <input v-model="product.price" v-if="product.isEdit" class="form-control"
                                    @keyup.enter="product.isEdit = false; updateProduct(product.id, product)">
                                <label v-else @click="product.isEdit = true;">\${{ product.price }}</label>
                            </td>

                            <td>
                                <input v-model="product.url" v-if="product.isEdit" class="form-control"
                                    @keyup.enter="product.isEdit = false; updateProduct(product.id, product)">
                                <img v-else @click="product.isEdit = true;" :src="product.url" width="50px" height="50px">
                            </td>

                            <td>
                                <button class="btn btn-danger" title="Delete Todo" @click="removeProduct(product.id)">
                                    <i class="fas fa-trash-alt text-light"></i>
                                </button>
                                <button class="btn btn-primary" title="Add To Cart" @click="addToCart(product)">
                                    <i class="fas fa-shopping-cart text-light"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <product-cart :addToCarts="addToCarts"></product-cart>
        </div>
    `,
    data() {
        return {
            addToCarts: [],
        }
    },
    methods: {
        addToCart(product) {
            let itemInCart = this.addToCarts.filter(item => item.id === product.id);

            let isItemInCart = itemInCart.length > 0;

            if (isItemInCart === false) {
                this.addToCarts.push(Vue.util.extend({}, product))
                alertMessage('Item Added to the cart successfully', 'success');
            } else {
                itemInCart[0].qty += product.qty;
                alertMessage('Item Added to the cart successfully', 'success');
            }
        },
        updateProduct(productId, product) {
            let productInCart = this.addToCarts.filter(item => item.id === productId);
            productInCart[0].name = product.name;
            productInCart[0].price = product.price;
            productInCart[0].url = product.url;
            alertMessage('Product Updated Successfully', 'success');
        },
        removeProduct(productId) {
            this.$emit("remove-product", productId);

            this.addToCarts = this.addToCarts.filter(cart => cart.id !== productId);
        },
    }
})