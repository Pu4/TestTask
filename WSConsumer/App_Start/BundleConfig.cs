﻿using System.Web.Optimization;
namespace WSConsumer{

        public static class BundleConfig
        {
            public static void RegisterBundles(BundleCollection bundles)
            {

                bundles.Add(new ScriptBundle("~/bundles/js").Include(
                    "~/Scripts/jquery-2.1.4.js",
                    "~/Scripts/bootstrap.js",
                    "~/Scripts/TableHandlers.js"
                    ));

                bundles.Add(new StyleBundle("~/bundles/css").Include(
                    "~/Content/Site.css",
                    new CssRewriteUrlTransform()
                    ));

                bundles.Add(new StyleBundle("~/bundles/bootstrap").Include(
                    "~/Content/bootstrap.css",
                    new CssRewriteUrlTransform()));

                BundleTable.EnableOptimizations = true;
            }
        }
}