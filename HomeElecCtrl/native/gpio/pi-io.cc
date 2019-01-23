#include <node.h>

namespace piio {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void TurnOn(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "on"));
}

void TurnOff(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "off"));
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "turnOn", TurnOn);
  NODE_SET_METHOD(exports, "turnOff", TurnOff);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
