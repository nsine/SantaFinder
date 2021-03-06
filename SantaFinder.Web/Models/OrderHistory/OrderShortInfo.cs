﻿using System;
using SantaFinder.Entities;

namespace SantaFinder.Web.Models.OrderHistory
{
    public class OrderShortInfo
    {
        public int Id { get; set; }
        public DateTime Datetime { get; set; }
        public Address Address { get; set; }
        public string ChildrenNames { get; set; }
        public OrderStatus Status { get; set; }
        public SantaShortInfo SantaInfo { get; set; }

    }
}