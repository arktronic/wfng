using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace WFNG.UI
{
    public static class Utility
    {
        public class NiceExpando : DynamicObject
        {
            private Dictionary<string, object?> _backingDictionary = new Dictionary<string, object?>();

            public override IEnumerable<string> GetDynamicMemberNames()
            {
                return _backingDictionary.Keys;
            }

            public Dictionary<string, object?> GetBackingDictionary()
            {
                return _backingDictionary;
            }

            public override bool TryGetMember(GetMemberBinder binder, out object result)
            {
                if (_backingDictionary.ContainsKey(binder.Name))
                {
                    result = _backingDictionary[binder.Name];
                }
                else
                {
                    result = null;
                }
                return true;
            }

            public override bool TrySetMember(SetMemberBinder binder, object value)
            {
                _backingDictionary[binder.Name] = value;
                return true;
            }
        }

        public static dynamic Dynamize(object target)
        {
            var expando = new NiceExpando();
            var expandoDict = expando.GetBackingDictionary();

            var targetProperties = target.GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic);
            foreach (var prop in targetProperties)
            {
                expandoDict[prop.Name] = prop.GetValue(target);
            }

            return expando;
        }
    }
}
