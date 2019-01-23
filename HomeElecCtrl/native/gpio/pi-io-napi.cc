// hello.cc using N-API
#include <node_api.h>

namespace demo {

napi_value TurnOn(napi_env env, napi_callback_info args) {
  napi_status status;
  size_t argc = 1;
  napi_value argv[1];
  //napi_value greeting;
  //napi_status status;

  int number = 0;
  status = napi_get_cb_info(env, args, &argc, argv, NULL, NULL);
  status = napi_get_value_int32(env, argv[0], &number);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Invalid number was passed as argument");
    return nullptr;
  }

  napi_value myNumber;
  number = number * 2;
  status = napi_create_int32(env, number, &myNumber);

  //status = napi_create_string_utf8(env, "on-napi", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) {
    return nullptr;
  }

  //return greeting;
  return myNumber;
}

napi_value TurnOff(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "off-napi", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, TurnOn, nullptr, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function for TurnOn");
    return nullptr;
  }

  status = napi_set_named_property(env, exports, "turnOn", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports with TurnOn function");
    return nullptr;
  }

  status = napi_create_function(env, nullptr, 0, TurnOff, nullptr, &fn);
  if (status != napi_ok) {
  napi_throw_error(env, NULL, "Unable to wrap native function for TurnOff");
    return nullptr;
  }

  status = napi_set_named_property(env, exports, "turnOff", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports with TurnOff function");
    return nullptr;
  }

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
