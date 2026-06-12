using Application.Abstractions.SignalR;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using System;
using System.Collections.Generic;
using System.Text;

namespace Presentation.Controllers
{
    [Route("api/test")]
    public class TestController : ApiController
    {
        private readonly IPresenceTracker _presenceTracker;
        public TestController(ISender sender, IPresenceTracker presenceTracker) : base(sender)
        {
            _presenceTracker = presenceTracker;
        }
        [HttpGet("presence")]
        public IActionResult GetPresence()
        {
            var presence = _presenceTracker.GetOnlineUsers();
            return Ok(presence);
        }
    }
}