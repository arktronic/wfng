using Microsoft.VisualStudio.TestTools.UnitTesting;
using WFNG.UI;

namespace WFNG.Tests
{
    [TestClass]
    public class UtilityTests
    {
        [TestMethod]
        public void DynamizeShouldTransformAnonymousClassToPubliclyAccessibleDynamicObject()
        {
            var anon = new { Prop1 = "a string", Prop2 = 999, Prop3 = true };

            var result = Utility.Dynamize(anon);

            Assert.AreEqual("a string", result.Prop1);
            Assert.AreEqual(999, result.Prop2);
            Assert.AreEqual(true, result.Prop3);
            Assert.AreEqual(null, result.Prop346346324);
        }
    }
}
