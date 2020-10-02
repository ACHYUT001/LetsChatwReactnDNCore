using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public HttpStatusCode Code { get; set; }
        public Object Error { get; set; }

        public RestException(HttpStatusCode code, Object error = null)
        {
            Error = error;

            Code = code;
        }
    }
}