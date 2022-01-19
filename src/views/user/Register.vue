<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10 class="mx-auto my-auto">
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
            <router-link tag="a" to="/user/register" class="white">{{ $t('dashboards.Smart-City-3') }}</router-link>
          </p>
        </div>
        <div class="form-side">
          <router-link tag="a" to="/"><span class="logo-single"/></router-link>
          <h6 class="mb-4">{{ $t('user.register')}}</h6>
          <b-form @submit.prevent="formSubmit">
            <label class="form-group has-float-label mb-4">
              <input type="text" class="form-control" v-model="fullname">
              <span>{{ $t('user.fullname') }}</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <input type="email" class="form-control" v-model="email">
              <span>{{ $t('user.email') }}</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <input type="password" class="form-control" v-model="password">
              <span>{{ $t('user.password') }}</span>
            </label>
            <div class="d-flex justify-content-end align-items-center">
              <b-button type="submit" variant="primary" size="lg" class="btn-shadow">{{ $t('user.register-button')}}
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
  export default {
    data() {
      return {
        fullname: '',
        email: '',
        password: ''
      }
    },
    methods: {
      formSubmit() {
        console.log('register')
        this.$router.push('/')
      }
    }
  }
</script>
<style>
  .title-animation {
    font-family: 'Nunito', sans-serif;
    color: transparent;
    letter-spacing: 0.01em;
    font-weight: bold;
  }

  .title-animation span {
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.9),
    0 15px 25px rgba(0, 0, 0, 0.3),
    0 -2px 3px rgba(0, 0, 0, 0.1),
    0 -5px 10px rgba(255, 255, 255, 0.5),
    0 5px 10px rgba(0, 0, 0, 0.3),
    0 3px 4px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(255, 255, 255, 0.45);

    animation: loading 2s ease-in-out infinite alternate;
  }

  @keyframes loading {
    to {
      text-shadow: 0 0 2px rgba(204, 208, 212, 0.2),
      0 0 3px rgba(0, 0, 0, 0.02),
      0 0 0 rgba(0, 0, 0, 0),
      0 0 0 rgba(255, 255, 255, 0),
      0 0 0 rgba(0, 0, 0, 0),
      0 0 0 rgba(255, 255, 255, 0),
      0 0 0 rgba(255, 255, 255, 0);
    }
  }

  .title-animation span:nth-child(2) {
    animation-delay: 0.5s;
  }

  .title-animation span:nth-child(3) {
    animation-delay: 1s;
  }

  .title-animation span:nth-child(4) {
    animation-delay: 1.5s;
  }

  .title-animation span:nth-child(5) {
    animation-delay: 2s;
  }

  .title-animation span:nth-child(6) {
    animation-delay: 2.5s;
  }

  .title-animation span:nth-child(7) {
    animation-delay: 3s;
  }

  .title-animation span:nth-child(8) {
    animation-delay: 3.5s;
  }

  .title-animation span:nth-child(9) {
    animation-delay: 4s;
  }
</style>
