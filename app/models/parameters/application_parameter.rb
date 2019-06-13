# frozen_string_literal: true

# custom Parameter-class
class ApplicationParameter < Parameter
  audited :except => [:priority], :associated_with => :application
  validates :name, :uniqueness => { :scope => :reference_id }
  validates :application, :presence => true

  def to_s
    "#{application.id ? application.name : 'unassociated'}: #{name} = #{value}"
  end

  def associated_type
    N_('application')
  end

  def associated_label
    application.to_label
  end
end
