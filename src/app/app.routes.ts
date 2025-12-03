import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'bluetooth',
    loadComponent: () => import('./bluetooth/bluetooth.page').then( m => m.BluetoothPage)
  },
  // {
  //   path: 'working-mode',
  //   loadComponent: () => import('./working-mode/working-mode.page').then( m => m.WorkingModePage)
  // },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'device',
    loadComponent: () => import('./device/device.page').then( m => m.DevicePage)
  },
  {
    path: 'mode',
    loadComponent: () => import('./mode/mode.page').then( m => m.ModePage)
  },
  {
    path: 'device-name',
    loadComponent: () => import('./device-name/device-name.page').then( m => m.DeviceNamePage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'set-password',
    loadComponent: () => import('./set-password/set-password.page').then( m => m.SetPasswordPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'testing',
    loadComponent: () => import('./testing/testing.page').then( m => m.TestingPage)
  },
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage)
  },
    {
    path: 'login-option',
    loadComponent: () => import('./login-option/login-option.page').then( m => m.LoginOptionPage)
  },

      {
    path: 'change-password',
    loadComponent: () => import('./change-password/change-password.page').then( m => m.ChangePasswordPage)
  },

        {
    path: 'confirm-account',
    loadComponent: () => import('./confirm-account/confirm-account.page').then( m => m.ConfirmAccountPage)
  },
          {
    path: 'edit-profile',
    loadComponent: () => import('./edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },
  {
    path: 'test',
    loadComponent: () => import('./test/test.page').then( m => m.TestPage)
  },
  {
    path: 'add-diffuser',
    loadComponent: () => import('./add-diffuser/add-diffuser.page').then( m => m.AddDiffuserPage)
  },
  {
    path: 'room-selector',
    loadComponent: () => import('./room-selector/room-selector.page').then( m => m.RoomSelectorPage)
  },

  {
    path: 'select-bluetooth',
    loadComponent: () => import('./select-bluetooth/select-bluetooth.page').then( m => m.SelectBluetoothPage)
  },
  {
    path: 'inner-mode-setting',
    loadComponent: () => import('./inner-mode-setting/inner-mode-setting.page').then( m => m.InnerModeSettingPage)
  },
  {
    path: 'inner-mode',
    loadComponent: () => import('./inner-mode/inner-mode.page').then( m => m.InnerModePage)
  },
  {
    path: 'bluetooth-lists',
    loadComponent: () => import('./bluetooth-lists/bluetooth-lists.page').then( m => m.BluetoothListsPage)
  },



];
