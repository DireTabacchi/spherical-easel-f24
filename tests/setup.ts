// <reference path="@/extensions/three-ext.d.ts" />
// <reference path="@/extensions/number-ext.d.ts" />

import Vue from "vue";
// import Vuetify from "vuetify";
// import Vuex from "vuex";
// import VueI18n from "vue-i18n";
import { Vector2, Vector3 } from "three";
import { config } from "@vue/test-utils";

// Vue.use(Vuex);
// Vue.use(Vuetify);
// Vue.use(VueI18n);

// Sove Vuetify components (like VDialog) look for an ancestor element
// with "data-app" attribute set. Missing the element, you will get
// lots of warning messaging during testing.
// Adding an extra div under the body solves the issue
const app = document.createElement("div");
app.setAttribute("data-app", "true");
document.body.appendChild(app);

// VueTestUtils.config?.mocks["$t"] = msg => translations[locale][msg];
if (config) {
  // config.mocks["$t"] = key => key;
  //   // config.logModifiedComponents = false;
}
/* Extension functions for Vector2 and Vector3 */
// Vector2.prototype.toFixed = function(precision) {
//   return (
//     "(" + this.x.toFixed(precision) + "," + this.y.toFixed(precision) + ")"
//   );
// };
// Vector3.prototype.toFixed = function(precision) {
//   return (
//     "(" +
//     this.x.toFixed(precision) +
//     "," +
//     this.y.toFixed(precision) +
//     "," +
//     this.z.toFixed(precision) +
//     ")"
//   );
// };

// Vector3.prototype.isZero = function(tolerance) {
//   const TOLERANCE = tolerance ?? Math.PI / 1000;
//   return (
//     Math.abs(this.x) < TOLERANCE &&
//     Math.abs(this.y) < TOLERANCE &&
//     Math.abs(this.z) < TOLERANCE
//   );
// };

// /* Extension functions for numbers */
// Number.prototype.toDegrees = function() {
//   return (Number(this) / Math.PI) * 180;
// };
// Number.prototype.toRadians = function() {
//   return (Number(this) * Math.PI) / 180;
// };

// /* Extension functions for arrays */
// Array.prototype.clear = function() {
//   Array.prototype.splice.call(this, 0, this.length);
// };

// Array.prototype.rotate = function(count) {
//   const len = this.length >>> 0;
//   let _count = count >> 0;
//   _count = ((_count % len) + len) % len;

//   // use splice.call() instead of this.splice() to make function generic
//   Array.prototype.push.apply(
//     this,
//     Array.prototype.splice.call(this, 0, _count)
//   );
//   return this;
// };

expect.extend({
  toBeVector3CloseTo(a: Vector3, p: number) {
    return {
      pass: true,
      message: () => "In progress"
    };
  }
});
