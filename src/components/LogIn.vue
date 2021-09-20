<template>
    <div class="log-in-wrapper">
        <div class="log-in">
            <h2 class="log-in-title">Sign in to SHOP</h2>
            <p class="log-in-remark">*The API may not work well so wait for a response or reload</p>

            <label class="username-label label" for="username-input">Username</label>
            <input 
                type="text" 
                class="username-input input" id="username-input"
                v-model="user.username"
                @blur="checkValidity"
            >
            <p class="error-message" :class="{shown : isUsernameInvalid}">please enter the username</p>

            <label class="password-label label" for="password-input">Password</label>
            <input 
                :type="passwordVisibility" 
                class="password-input input" id="password-input"
                v-model="user.password"
                @blur="checkValidity"
            >
            <p class="error-message" :class="{shown : isPasswordInvalid}">please enter the password</p>

            <div class="checkbox">
                <input 
                    type="checkbox" class="checkbox-input" id="checkbox-input"
                    @change="changePasswordVisibility"
                >
                <label class="checkbox-label" for="checkbox-input">show password</label>
            </div>

            <div class="error">
                <p class="error-message" :class="{shown : signInError}">Error: {{errorMessage}}</p>
            </div>

            <div class="log-in-buttons">
                <button class="log-in-button button-cancel" @click="cancel">Cancel</button>
                <button 
                    class="log-in-button button-sign-in" 
                    @click="logIn"
                    :disabled="isUsernameInvalid || isPasswordInvalid"
                >Sign in</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    data() {
        return {
            username: '',
            password: '',
            errorMessage: 'Incorrect username or password',
            isUsernameInvalid: false,
            isPasswordInvalid: false,
            passwordVisibility: 'password',
        }
    },
    computed: {
        // User data from API
        user() {
            return this.$store.getters.getUser
        },
        // API sign-in response
        signInAnswer() {
            return this.$store.getters.getSignInAnswer
        },

        signInError(): boolean {
            if(this.signInAnswer.status === 'Error' || this.isUsernameInvalid || this.isPasswordInvalid) {
                this.$store.commit('waitingCompleted')
                return true
            } 
            else if(this.signInAnswer.status === 'Log out') {
                return false
            }
            else if(this.signInAnswer.token){
                this.$emit('onSigned')
                return false
            } else {
                return false
            }
        },
    },
    methods: {
        logIn() {
            // Start waiting animation
            this.$store.commit('waitingOn')

            // check inpts validity
            this.checkValidity()

            // Save input values
            this.username = this.user.username
            this.password = this.user.password

            // Post input values to API
            this.$store.dispatch('postUserSignIn', [this.username, this.password])
        },
        cancel() {
            this.$emit('onCanceled')
        },
        checkValidity() {
            if(this.user.username === '') {
                this.isUsernameInvalid = true
            } else {
                this.isUsernameInvalid = false
            }
            if(this.user.password === '') {
                this.isPasswordInvalid = true
            } else {
                this.isPasswordInvalid = false
            }
        },
        changePasswordVisibility() {
            if(this.passwordVisibility === 'password') {
                this.passwordVisibility = 'text'
            } else 
            if(this.passwordVisibility === 'text') {
                this.passwordVisibility = 'password'
            }
        }
    },
})
</script>

<style lang="scss" scoped>
    .log-in-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.2);
    }
    .log-in {
        padding: 36px 46px;
        min-width: 360px;

        position: absolute;
        top: 10vh;
        right: 50%;
        transform: translateX(50%);

        display: flex;
        flex-direction: column;
        
        border-radius: 8px;
        background-color: #fff;
        z-index: 101;
    }
    .log-in-title {
        text-align: center;
    }
    .log-in-remark {
        font-size: 12px;
        color: var(--grey-dark);
     }
    .label {
        font-weight: 400;
        font-size: 16px;
        margin-bottom: 9px;
        margin-top: 24px;

        &:first-child {
            margin-top: 0px;
        }
    }
    .input {
        margin-bottom: 4px;
        padding: 8px 12px;
        border: 1px solid var(--grey-dark);
        border-radius: 4px;

        font-weight: 500;
        font-size: 16px; 
    }

    .password-input {
        margin-bottom: 4px;
    }

    .checkbox {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
    }
    .checkbox-label {
        font-weight: 400;
        font-size: 14px;
    }

    
    .error-message {
        font-weight: 400;
        font-size: 14px;
        color: var(--red);
        display: none;

        &.shown {
            display: block;
        }
    }    

    .log-in-buttons {
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
    }
    .log-in-button {
        padding: 4px 22px;
        border-radius: 4px;
        cursor: pointer;

        font-weight: 700;
        font-size: 16px;

        &:active {
            transform: scale(0.99);
        }
    }
    .button-cancel {
        background-color: var(--grey-light);
        border: 1px solid ;
        color: var(--grey-dark);

        &:hover {
            background-color: var(--grey-dark);
            color: var(--grey-light);
        }
    }
    .button-sign-in {
        background-color: var(--main-light);
        border: 1px solid var(--main-dark);
        color: var(--main-dark);

        &:hover {
            background-color: var(--main-dark);
            color: var(--main-light);
        }
    }
</style>