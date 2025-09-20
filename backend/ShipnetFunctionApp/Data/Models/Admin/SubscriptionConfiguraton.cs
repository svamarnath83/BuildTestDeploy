using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;
using static Grpc.Core.Metadata;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
    {
        public void Configure(EntityTypeBuilder<Subscription> entity)
        {
            entity.ToTable("subscriptions");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .IsRequired();

            entity.Property(e => e.AccountCode)
              .HasColumnName("accountcode")
              .IsRequired();

            entity.Property(e => e.Schema)
            .HasColumnName("schema")
            .IsRequired();
        }
    }
}
