Vue.component('product-cart', {
    props: {
        addToCarts: {
            type: Array,
            required: true,
        }
    },
    template: `
        <div class="col-lg-6 cart-section">
            <h3 class="font-weight-bold mb-3">Cart Details:</h3>
            <p v-if="!addToCarts.length" class="text-secondary">No cart item found.</p>
            <span v-for="(addToCart,index) in addToCarts" class="shadow-lg" :key="addToCart.id">
                <div class="row mb-3">
                    <div class="col-lg-3">
                        <img :src="addToCart.url" width="50px" height="50px">
                    </div>

                    <div class="col-lg-7">
                        <span>{{ addToCart.name }}</span><br>
                        <span>\${{ addToCart.price }}</span>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-lg-5">
                        <input v-model="addToCart.qty" class="form-control" type="text" readonly>
                    </div>

                    <div class="col-lg-5">
                        <button class="btn btn-secondary mr-1" title="Plus Quantity" @click="plusCartQuantity(addToCart)">
                            +
                        </button>
                        <button class="btn btn-secondary mr-1" title="Minus Quantity" @click="minusCartQuantity(addToCart)">
                            -
                        </button>
                        <button class="btn btn-danger" title="Remove Cart" @click="removeCartItem(index)">
                            X
                        </button>
                    </div>
                </div>
            </span>

            <hr class="bg-warning">

            <form @submit.prevent="applyDiscount">
                <div class="row">
                    <div class="col-lg-3">
                        <select class="form-control" id="discount-type">
                            <option value="%" selected>%</option>
                            <option value="$">$</option>
                        </select>
                    </div>

                    <div class="col-lg-6">
                        <input type="text" class="form-control" id="discount-value" placeholder="Discount">
                    </div>

                    <div class="col-lg-3">
                        <button class="btn btn-info">Apply</button>
                    </div>
                </div>
            </form>

            <hr class="bg-warning">

            <p>SubTotal: {{ subTotal }}</p>
            <p v-show="discountValue">Discount: {{ discount }}</p>
            <p v-show="shippingValue">Shipping Charge: {{ shipping }}</p>
            <p v-show="netTotalValue">Net Total: {{ netTotal }}</p>
            <p>Tax: {{ tax }}</p>
            <p>Total: {{ total }}</p>
            <p>Round off: {{ roundOff }}</p>
            <p>Payable: {{ payable }}</p>
        </div>
    `,
    data() {
        return {
            finalSubTotal: '',
            finalTax: '',
            finalTotal: '',
            finalRoundOff: '',
            shippingValue: false,
            finalShipping: '',
            netTotalValue: false,
            finalNetTotal: '',
            finalDiscountType: '',
            finalDiscountValue: '',
            discountValue: false,
        }
    },
    computed: {
        subTotal() {
            let subTotal = 0;
            this.addToCarts.forEach(item => {
                subTotal += (item.price * item.qty);
            });

            this.finalSubTotal = subTotal;

            return '$' + subTotal.toFixed(2);
        },
        discount() {
            if (this.finalDiscountType === '$') {
                if (this.finalDiscountValue > this.finalSubTotal) {
                    alertMessage('Something went wrong', 'error');
                    return;
                }

                this.discountValue = true;

                alertMessage('Discount applied successfully', 'success');

                return '$' + this.finalDiscountValue + '.00';

            } else if (this.finalDiscountType === '%') {
                this.discountValue = true;
                this.finalDiscountValue = this.finalSubTotal * this.finalDiscountValue / 100;

                alertMessage('Discount applied successfully', 'success');

                return '$' + this.finalDiscountValue;
            }
        },
        shipping() {
            let shipping = 0
            if (this.finalSubTotal > 0 && this.finalSubTotal <= 100) {
                this.shippingValue = true;
                shipping = this.finalSubTotal * 4 / 100;
                this.finalShipping = shipping;

                return '$' + shipping.toFixed(2);
            } else {
                this.finalShipping = 0;
                this.shippingValue = false;
            }
        },
        netTotal() {
            let netTotal = 0;

            if (this.finalDiscountValue > this.finalSubTotal) {
                return;
            }

            if (this.shippingValue === true) {
                this.netTotalValue = true;
                if (this.finalDiscountValue != '') {
                    netTotal = this.finalSubTotal + this.finalShipping - this.finalDiscountValue;
                } else {
                    netTotal = this.finalSubTotal + this.finalShipping;
                }
                this.finalNetTotal = netTotal;

                return '$' + netTotal.toFixed(2);
            } else {
                this.finalNetTotal = 0;
                this.netTotalValue = false;
            }
        },
        tax() {
            let subTotal = 0;
            let tax = 0;

            if (this.finalDiscountValue > this.finalSubTotal) {
                return;
            }

            this.addToCarts.forEach(item => {
                subTotal += (item.price * item.qty);
            });

            if (subTotal <= 100) {
                tax = this.finalNetTotal * 4 / 100;
                this.finalTax = tax;
            } else {
                tax = subTotal * 4 / 100;
                this.finalTax = tax;
            }

            return '$' + tax.toFixed(2);
        },
        total() {
            let total = 0;

            if (this.finalDiscountValue > this.finalSubTotal) {
                return;
            }

            if (this.finalSubTotal <= 100) {
                total = this.finalNetTotal + this.finalTax;
            } else {
                total = this.finalSubTotal + this.finalTax;
            }

            this.finalTotal = total;

            return '$' + total.toFixed(2);
        },
        roundOff() {
            let total = this.finalTotal;

            if (this.finalDiscountValue > this.finalSubTotal) {
                return;
            }

            let roundOffTotal = Math.round(total);

            let roundOff = roundOffTotal.toFixed(2)  - total.toFixed(2);

            this.finalRoundOff = roundOffTotal;

            return '$' + roundOff.toFixed(2);
        },
        payable() {
            if (this.finalDiscountValue > this.finalSubTotal) {
                return;
            }

            let payable = this.finalRoundOff;

            return '$' + payable.toFixed(2);
        }
    },
    methods: {
        applyDiscount() {
            let type = document.getElementById('discount-type').value;
            let value = document.getElementById('discount-value').value;
            if (value == '') {
                alertMessage('Please enter discount value', 'error');
                return;
            }
            this.finalDiscountType = type;
            this.finalDiscountValue = value;
        },
        removeCartItem(index) {
            this.addToCarts.splice(index, 1);

            alertMessage('Item removed from the cart successfully', 'success');
        },
        plusCartQuantity(addToCart) {
            let itemInCartForPlus = this.addToCarts.filter(item => item.id === addToCart.id);
            itemInCartForPlus[0].qty += 1;
            alertMessage('Cart item updated successfully', 'success');
        },
        minusCartQuantity(addToCart) {
            let itemInCartForMinus = this.addToCarts.filter(item => item.id === addToCart.id);
            itemInCartForMinus[0].qty -= 1;

            if (itemInCartForMinus[0].qty === 0) {
                this.addToCarts.splice(0 - 1, 1);
            }
            alertMessage('Cart item updated successfully', 'success');
        },
    }
})
