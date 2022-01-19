<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <h1 class="title-animation text-uppercase">
            <span>s</span>
            <span>m</span>
            <span>a</span>
            <span>r</span>
            <span>t</span>
            &nbsp;
            <span>c</span>
            <span>i</span>
            <span>t</span>
            <span>y</span>
          </h1>
          <p class="white mb-0">
            {{ $t('dashboards.Smart-City-1') }}
            <br/>{{ $t('dashboards.Smart-City-2') }}
<!--            <router-link tag="a" to="/user/register" class="white" style="text-decoration: underline">{{ $t('dashboards.Smart-City-3') }}</router-link>.-->
          </p>
        </div>
        <div class="form-side">
          <router-link tag="a" to="/">
            <span class="logo-single"/>
          </router-link>
          <h6 class="mb-4"><strong>{{ $t('user.login-title')}}</strong></h6>
          <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
            <b-form-group :label="$t('user.username')" class="has-float-label mb-4">
              <b-form-input type="text" v-model="$v.form.username.$model" :state="!$v.form.username.$error"/>
              <b-form-invalid-feedback v-if="!$v.form.username.required">{{$t('user.username-required')}}</b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!$v.form.username.minLength">{{$t('user.username-min-length')}}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
              <b-form-input type="password" v-model="$v.form.password.$model" :state="!$v.form.password.$error"/>
              <b-form-invalid-feedback v-if="!$v.form.password.required">{{$t('user.pass-required')}}</b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!$v.form.password.minLength || !$v.form.password.maxLength">{{$t('user.pass-min-max')}}</b-form-invalid-feedback>
            </b-form-group>
            <div class="d-flex justify-content-between align-items-center">
<!--              <router-link tag="a" to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link>-->
              <div class="d-inline-block">
                <b-dropdown id="langddm" class="ml-2" variant="light" size="sm" toggle-class="language-button">
                  <template slot="button-content">
                    <b-img alt="img_language" v-for="(k,index) in localeOption" v-if="k.id === $i18n.locale" fluid :key="index"
                           :src="k.icon" width="30"/>
                    <span class="name">{{$i18n.locale.toUpperCase()}}</span>
                  </template>
                  <b-dropdown-item v-for="(l,index) in localeOption" :key="index" @click="changeLocale(l.id, l.direction)">
                    <b-img alt="img_language" fluid :src="l.icon" width="30"/>
                    <span class="ml-2">{{l.name}}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                    'show-spinner': processing,
                    'show-success': !processing && loginError===false,
                    'show-fail': !processing && loginError }">
                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>
                <span class="label">{{ $t('user.login-button') }}</span>
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import {validationMixin} from "vuelidate";

  const {required, maxLength, minLength} = require("vuelidate/lib/validators");
  import methods from "../../function/api";
  import {localeOption} from "../../constants/config";
  import {getDirection, setDirection} from "../../utils";

  export default {
    data() {
      return {
        form: {
          username: "",
          password: ""
        },
        localeOption,
      };
    },
    mixins: [validationMixin],
    validations: {
      form: {
        username: {
          minLength: minLength(3),
          required,
        },
        password: {
          required,
          maxLength: maxLength(16),
          minLength: minLength(3)
        }
      }
    },
    computed: {
      ...mapGetters(["currentUser", "processing", "loginError"])
    },
    methods: {
      ...mapActions(['login', 'setLang']),
      formSubmit() {
        this.$v.$touch();
        this.$v.form.$touch();
        this.login(methods.post("/api/authentication/LoginUser",{
          UserName: this.form.username,
          UserPassword: this.form.password
        }));
      },
      changeLocale(locale, direction) {
        const currentDirection = getDirection().direction
        if (direction !== currentDirection) {
          setDirection(direction)
        }
        this.setLang(locale)
      },
    },
    watch: {
      currentUser(val) {
        if (val) {
          setTimeout(() => {
            this.$router.push("/");
          }, 200);
        }
      },
      loginError(val) {
        if (val != null) {
          this.$notify("error", "Lỗi đăng nhập", val, {
            duration: 3000,
            permanent: false
          });
        }
      }
    }
  };
</script>
<style>
 .title-animation {
   font-family: 'Nunito', sans-serif;
   color: transparent;
   letter-spacing: 0.01em;
   font-weight: bold;
 }

 .title-animation span {
   text-shadow:
     0 0 2px rgba(255, 255, 255, 0.9),
     0 15px 25px rgba(0, 0, 0, 0.3),
     0 -2px 3px rgba(0, 0, 0, 0.1),
     0 -5px 10px rgba(255, 255, 255, 0.5),
     0 5px 10px rgba(0, 0, 0, 0.3),
     0 3px 4px rgba(255, 255, 255, 0.2),
     0 0 20px rgba(255, 255, 255, 0.45);

   animation: loading 2s ease-in-out infinite alternate;
 }

  @keyframes loading {
    to {text-shadow:
      0 0 2px rgba(204, 208, 212, 0.2),
      0 0 3px rgba(0, 0, 0, 0.02),
      0 0 0 rgba(0, 0, 0, 0),
      0 0 0 rgba(255, 255, 255, 0),
      0 0 0 rgba(0, 0, 0, 0),
      0 0 0 rgba(255, 255, 255, 0),
      0 0 0 rgba(255, 255, 255, 0);}
  }

  .title-animation span:nth-child(2){
    animation-delay:0.5s;
  }
  .title-animation span:nth-child(3){
    animation-delay:1s;
  }
  .title-animation span:nth-child(4){
    animation-delay:1.5s;
  }
  .title-animation span:nth-child(5){
    animation-delay:2s;
  }
  .title-animation span:nth-child(6){
    animation-delay:2.5s;
  }
  .title-animation span:nth-child(7){
    animation-delay:3s;
  }
 .title-animation span:nth-child(8){
   animation-delay:3.5s;
 }
 .title-animation span:nth-child(9){
   animation-delay:4s;
 }
</style>
